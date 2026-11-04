import { con } from '../database.js';

export async function listarDisponiveis(busca = '') {
    const termo = `%${busca}%`;
    const [linhas] = await con.query(`
        select d.id, d.nome_alimento, d.categoria, d.quantidade, d.unidade,
               d.validade, d.retirada_ate, d.endereco_retirada, d.observacoes,
               d.status, d.criado_em, e.nome as estabelecimento, e.cidade, e.estado
          from doacoes d
          join estabelecimentos e on e.id = d.estabelecimento_id
         where d.status = 'DISPONIVEL'
           and (d.nome_alimento like ? or d.categoria like ? or e.cidade like ?)
         order by d.criado_em desc
    `, [termo, termo, termo]);
    return linhas;
}

export async function criarDoacao(dados, estabelecimentoId) {
    const [resultado] = await con.query(`
        insert into doacoes
        (estabelecimento_id, nome_alimento, categoria, quantidade, unidade,
         validade, retirada_ate, endereco_retirada, observacoes, status)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, 'DISPONIVEL')
    `, [
        estabelecimentoId, dados.nomeAlimento, dados.categoria, dados.quantidade,
        dados.unidade, dados.validade || null, dados.retiradaAte || null,
        dados.enderecoRetirada, dados.observacoes || null
    ]);
    return resultado.insertId;
}

export async function listarMinhasDoacoes(estabelecimentoId) {
    const [linhas] = await con.query(
        'select * from doacoes where estabelecimento_id = ? order by criado_em desc',
        [estabelecimentoId]
    );
    return linhas;
}

export async function buscarDoacao(id) {
    const [linhas] = await con.query('select * from doacoes where id = ?', [id]);
    return linhas[0];
}
