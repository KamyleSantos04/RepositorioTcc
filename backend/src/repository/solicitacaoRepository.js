import { con } from '../database.js';

export async function criarSolicitacao(doacaoId, instituicaoId, mensagem = '') {
    const [resultado] = await con.query(`
        insert into solicitacoes (doacao_id, instituicao_id, mensagem, status)
        values (?, ?, ?, 'PENDENTE')
    `, [doacaoId, instituicaoId, mensagem || null]);
    return resultado.insertId;
}

export async function listarMinhasSolicitacoes(instituicaoId) {
    const [linhas] = await con.query(`
        select s.id, s.mensagem, s.status, s.criado_em,
               d.nome_alimento, d.quantidade, d.unidade, d.validade,
               e.nome as estabelecimento, e.cidade, e.estado
          from solicitacoes s
          join doacoes d on d.id = s.doacao_id
          join estabelecimentos e on e.id = d.estabelecimento_id
         where s.instituicao_id = ?
         order by s.criado_em desc
    `, [instituicaoId]);
    return linhas;
}

export async function listarRecebidas(estabelecimentoId) {
    const [linhas] = await con.query(`
        select s.id, s.mensagem, s.status, s.criado_em,
               d.nome_alimento, d.quantidade, d.unidade,
               i.nome as instituicao, i.cidade, i.estado
          from solicitacoes s
          join doacoes d on d.id = s.doacao_id
          join instituicoes i on i.id = s.instituicao_id
         where d.estabelecimento_id = ?
         order by s.criado_em desc
    `, [estabelecimentoId]);
    return linhas;
}

export async function atualizarStatus(id, estabelecimentoId, status) {
    const [resultado] = await con.query(`
        update solicitacoes s
        join doacoes d on d.id = s.doacao_id
           set s.status = ?
         where s.id = ? and d.estabelecimento_id = ?
    `, [status, id, estabelecimentoId]);
    return resultado.affectedRows;
}
