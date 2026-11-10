import { con } from '../database.js';

export async function criarSolicitacao(doacaoId, instituicaoId, mensagem = '') {
    const [resultado] = await con.query(`
        insert into solicitacoes13 (doacao_id, instituicao_id, mensagem, status)
        values (?, ?, ?, 'PENDENTE')
    `, [doacaoId, instituicaoId, mensagem || null]);
    return resultado.insertId;
}

/**
 * Cria uma solicitação sem deixar espaço para uma corrida entre a checagem da
 * disponibilidade e o insert. A doação é bloqueada durante a operação; ela
 * continua disponível enquanto as solicitações estiverem pendentes, mas deixa
 * de estar disponível assim que o estabelecimento aceitar uma delas.
 */
export async function criarSolicitacaoAtomica(doacaoId, instituicaoId, mensagem = '') {
    const conexao = await con.getConnection();

    try {
        await conexao.beginTransaction();

        const [doacoes] = await conexao.query(`
            select id
              from doacoes13
             where id = ? and status = 'DISPONIVEL'
             for update
        `, [doacaoId]);

        if (!doacoes[0]) {
            await conexao.rollback();
            return { motivo: 'INDISPONIVEL' };
        }

        const [existentes] = await conexao.query(`
            select id
              from solicitacoes13
             where doacao_id = ?
               and instituicao_id = ?
               and status in ('PENDENTE', 'ACEITA')
             for update
        `, [doacaoId, instituicaoId]);

        if (existentes[0]) {
            await conexao.rollback();
            return { motivo: 'DUPLICADA' };
        }

        const [resultado] = await conexao.query(`
            insert into solicitacoes13 (doacao_id, instituicao_id, mensagem, status)
            values (?, ?, ?, 'PENDENTE')
        `, [doacaoId, instituicaoId, mensagem || null]);

        await conexao.commit();
        return { id: resultado.insertId };
    } catch (erro) {
        await conexao.rollback();
        throw erro;
    } finally {
        conexao.release();
    }
}

export async function buscarSolicitacaoAberta(doacaoId, instituicaoId) {
    const [linhas] = await con.query(`
        select id
          from solicitacoes13
         where doacao_id = ?
           and instituicao_id = ?
           and status in ('PENDENTE', 'ACEITA')
    `, [doacaoId, instituicaoId]);
    return linhas[0];
}

export async function listarMinhasSolicitacoes(instituicaoId) {
    const [linhas] = await con.query(`
        select s.id, s.mensagem, s.status, s.criado_em,
               d.id as doacao_id, d.nome_alimento, d.quantidade, d.unidade,
               d.validade, d.retirada_ate, d.endereco_retirada,
               e.nome as estabelecimento, e.cidade, e.estado, e.telefone
          from solicitacoes13 s
          join doacoes13 d on d.id = s.doacao_id
          join estabelecimentos13 e on e.id = d.estabelecimento_id
         where s.instituicao_id = ?
         order by s.criado_em desc
    `, [instituicaoId]);
    return linhas;
}

export async function listarRecebidas(estabelecimentoId) {
    const [linhas] = await con.query(`
        select s.id, s.mensagem, s.status, s.criado_em,
               d.id as doacao_id, d.nome_alimento, d.quantidade, d.unidade,
               i.nome as instituicao, i.cidade, i.estado, i.telefone,
               i.pessoas_atendidas
          from solicitacoes13 s
          join doacoes13 d on d.id = s.doacao_id
          join instituicoes13 i on i.id = s.instituicao_id
         where d.estabelecimento_id = ?
         order by s.criado_em desc
    `, [estabelecimentoId]);
    return linhas;
}

export async function atualizarStatus(id, estabelecimentoId, status) {
    const conexao = await con.getConnection();

    try {
        await conexao.beginTransaction();

        const [linhas] = await conexao.query(`
            select s.id, s.doacao_id, s.status as status_solicitacao,
                   d.status as status_doacao
              from solicitacoes13 s
              join doacoes13 d on d.id = s.doacao_id
             where s.id = ? and d.estabelecimento_id = ?
             for update
        `, [id, estabelecimentoId]);

        const solicitacao = linhas[0];
        if (!solicitacao) {
            await conexao.rollback();
            return 0;
        }

        if (
            solicitacao.status_solicitacao !== 'PENDENTE' ||
            (status === 'ACEITA' && solicitacao.status_doacao !== 'DISPONIVEL')
        ) {
            await conexao.rollback();
            return -1;
        }

        await conexao.query(`
            update solicitacoes13
               set status = ?, atualizado_em = current_timestamp
             where id = ?
        `, [status, id]);

        if (status === 'ACEITA') {
            await conexao.query(`
                update doacoes13 set status = 'RESERVADA' where id = ?
            `, [solicitacao.doacao_id]);

            await conexao.query(`
                update solicitacoes13
                   set status = 'RECUSADA', atualizado_em = current_timestamp
                 where doacao_id = ?
                   and id <> ?
                   and status = 'PENDENTE'
            `, [solicitacao.doacao_id, id]);
        }

        if (status === 'RECUSADA') {
            const [restantes] = await conexao.query(`
                select count(*) as total
                  from solicitacoes13
                 where doacao_id = ? and status = 'ACEITA'
            `, [solicitacao.doacao_id]);

            if (Number(restantes[0].total) === 0) {
                await conexao.query(`
                    update doacoes13
                       set status = 'DISPONIVEL'
                     where id = ? and status = 'RESERVADA'
                `, [solicitacao.doacao_id]);
            }
        }

        await conexao.commit();
        return 1;
    } catch (erro) {
        await conexao.rollback();
        throw erro;
    } finally {
        conexao.release();
    }
}

export async function resumoInstituicao(instituicaoId) {
    const [linhas] = await con.query(`
        select
            (select count(*) from solicitacoes13
              where instituicao_id = ?
                and status = 'PENDENTE') as solicitacoes_pendentes,
            (select count(*) from solicitacoes13
              where instituicao_id = ?
                and status = 'ACEITA') as solicitacoes_aceitas,
            (select count(*) from solicitacoes13
              where instituicao_id = ?
                and status = 'CONCLUIDA') as solicitacoes_concluidas,
            (select count(*) from solicitacoes13
              where instituicao_id = ?
                and status = 'RECUSADA') as solicitacoes_recusadas,
            (select coalesce(sum(d.quantidade), 0)
               from solicitacoes13 s
               join doacoes13 d on d.id = s.doacao_id
              where s.instituicao_id = ?
                and s.status = 'CONCLUIDA') as quantidade_recebida,
            (select count(distinct d.estabelecimento_id)
               from solicitacoes13 s
               join doacoes13 d on d.id = s.doacao_id
              where s.instituicao_id = ?
                and s.status in ('ACEITA', 'CONCLUIDA')) as estabelecimentos_parceiros
    `, Array(6).fill(instituicaoId));

    return linhas[0];
}

export async function concluirSolicitacao(id, instituicaoId) {
    const conexao = await con.getConnection();

    try {
        await conexao.beginTransaction();

        const [linhas] = await conexao.query(`
            select s.id, s.doacao_id
              from solicitacoes13 s
              join doacoes13 d on d.id = s.doacao_id
             where s.id = ?
               and s.instituicao_id = ?
               and s.status = 'ACEITA'
               and d.status = 'RESERVADA'
             for update
        `, [id, instituicaoId]);

        const solicitacao = linhas[0];
        if (!solicitacao) {
            await conexao.rollback();
            return 0;
        }

        await conexao.query(`
            update solicitacoes13
               set status = 'CONCLUIDA', atualizado_em = current_timestamp
             where id = ?
        `, [id]);

        await conexao.query(`
            update doacoes13 set status = 'CONCLUIDA' where id = ?
        `, [solicitacao.doacao_id]);

        await conexao.query(`
            update solicitacoes13
               set status = 'RECUSADA', atualizado_em = current_timestamp
             where doacao_id = ?
               and id <> ?
               and status = 'PENDENTE'
        `, [solicitacao.doacao_id, id]);

        await conexao.commit();
        return 1;
    } catch (erro) {
        await conexao.rollback();
        throw erro;
    } finally {
        conexao.release();
    }
}
