import { con } from '../database.js';

const CAMPOS_DOACAO = `
    d.id,
    d.nome_alimento,
    d.categoria,
    d.quantidade,
    d.unidade,
    d.validade,
    d.retirada_ate,
    d.endereco_retirada,
    d.observacoes,
    d.status,
    d.criado_em
`;

export async function listarDisponiveis(busca = '') {
    const termo = `%${busca}%`;
    const [linhas] = await con.query(`
        select ${CAMPOS_DOACAO},
               e.nome as estabelecimento,
               e.cidade,
               e.estado
          from doacoes13 d
          join estabelecimentos13 e on e.id = d.estabelecimento_id
         where d.status = 'DISPONIVEL'
           and (d.nome_alimento like ?
             or d.categoria like ?
             or e.cidade like ?)
         order by d.criado_em desc
    `, [termo, termo, termo]);
    return linhas;
}

export async function criarDoacao(dados, estabelecimentoId) {
    const [resultado] = await con.query(`
        insert into doacoes13
        (estabelecimento_id, nome_alimento, categoria, quantidade, unidade,
         validade, retirada_ate, endereco_retirada, observacoes, status)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, 'DISPONIVEL')
    `, [
        estabelecimentoId,
        dados.nomeAlimento,
        dados.categoria || null,
        dados.quantidade,
        dados.unidade,
        dados.validade || null,
        dados.retiradaAte || null,
        dados.enderecoRetirada,
        dados.observacoes || null
    ]);
    return resultado.insertId;
}

export async function listarMinhasDoacoes(estabelecimentoId) {
    const [linhas] = await con.query(`
        select ${CAMPOS_DOACAO},
               (select count(*)
                  from solicitacoes13 s
                 where s.doacao_id = d.id
                   and s.status in ('PENDENTE', 'ACEITA')) as total_solicitacoes
          from doacoes13 d
         where d.estabelecimento_id = ?
         order by d.criado_em desc
    `, [estabelecimentoId]);
    return linhas;
}

export async function buscarDoacao(id) {
    const [linhas] = await con.query(
        'select * from doacoes13 where id = ?',
        [id]
    );
    return linhas[0];
}

const STATUS_COM_SOLICITACAO_ATIVA = ['ACEITA', 'CONCLUIDA'];

/**
 * Atualiza o status de uma doação do estabelecimento logado.
 *
 * Regra de negócio: uma doação que já foi destinada a uma instituição
 * (solicitação aceita ou concluída) não pode voltar a ficar livremente
 * disponível para outras instituições.
 *
 * Retorna:
 *   1  -> atualizado
 *   0  -> doação não encontrada para este estabelecimento
 *  -1  -> alteração bloqueada pela regra de negócio
 */
export async function atualizarStatus(id, estabelecimentoId, status) {
    const conexao = await con.getConnection();

    try {
        await conexao.beginTransaction();

        const [linhas] = await conexao.query(`
            select id, status
              from doacoes13
             where id = ? and estabelecimento_id = ?
             for update
        `, [id, estabelecimentoId]);

        const doacao = linhas[0];

        if (!doacao) {
            await conexao.rollback();
            return 0;
        }

        if (status === 'DISPONIVEL' && doacao.status !== 'DISPONIVEL') {
            const [vinculos] = await conexao.query(`
                select count(*) as total
                  from solicitacoes13
                 where doacao_id = ?
                   and status in (?, ?)
            `, [id, ...STATUS_COM_SOLICITACAO_ATIVA]);

            if (Number(vinculos[0].total) > 0) {
                await conexao.rollback();
                return -1;
            }
        }

        await conexao.query(`
            update doacoes13
               set status = ?, atualizado_em = current_timestamp
             where id = ? and estabelecimento_id = ?
        `, [status, id, estabelecimentoId]);

        await conexao.commit();
        return 1;
    } catch (erro) {
        await conexao.rollback();
        throw erro;
    } finally {
        conexao.release();
    }
}

export async function removerDoacao(id, estabelecimentoId) {
    const [resultado] = await con.query(`
        delete from doacoes13
         where id = ? and estabelecimento_id = ?
    `, [id, estabelecimentoId]);
    return resultado.affectedRows;
}

export async function resumoEstabelecimento(estabelecimentoId) {
    const [linhas] = await con.query(`
        select
            (select count(*) from doacoes13
              where estabelecimento_id = ?
                and status = 'DISPONIVEL') as doacoes_ativas,
            (select count(*) from doacoes13
              where estabelecimento_id = ?
                and status = 'RESERVADA') as doacoes_reservadas,
            (select count(*) from doacoes13
              where estabelecimento_id = ?
                and status = 'CONCLUIDA') as doacoes_concluidas,
            (select count(*) from doacoes13
              where estabelecimento_id = ?
                and status = 'CANCELADA') as doacoes_canceladas,
            (select count(*) from solicitacoes13 s
               join doacoes13 d on d.id = s.doacao_id
              where d.estabelecimento_id = ?
                and s.status = 'PENDENTE') as solicitacoes_pendentes,
            (select coalesce(sum(d.quantidade), 0) from doacoes13 d
              where d.estabelecimento_id = ?
                and d.status = 'CONCLUIDA') as quantidade_destinada
    `, Array(6).fill(estabelecimentoId));

    return linhas[0];
}
