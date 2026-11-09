import { con } from '../database.js';

const CAMPOS_PUBLICOS = `
    id,
    nome,
    tipo_instituicao,
    descricao,
    cidade,
    estado,
    pessoas_atendidas,
    frequencia_doacao,
    alimentos_necessarios
`;

export async function listarInstituicoes(busca = '') {
    const termo = `%${busca}%`;

    const [linhas] = await con.query(`
        select ${CAMPOS_PUBLICOS}
          from instituicoes13
         where nome like ?
            or cidade like ?
            or alimentos_necessarios like ?
         order by nome
    `, [termo, termo, termo]);

    return linhas;
}

export async function buscarInstituicaoPorId(id) {
    const [linhas] = await con.query(
        'select * from instituicoes13 where id = ?',
        [id]
    );
    return linhas[0];
}

export async function atualizarInstituicao(id, dados) {
    const [resultado] = await con.query(`
        update instituicoes13
           set nome = ?,
               tipo_instituicao = ?,
               outro_tipo = ?,
               descricao = ?,
               responsavel = ?,
               telefone = ?,
               cep = ?,
               estado = ?,
               rua = ?,
               numero = ?,
               complemento = ?,
               bairro = ?,
               cidade = ?,
               pessoas_atendidas = ?,
               frequencia_doacao = ?,
               alimentos_necessarios = ?,
               observacoes = ?
         where id = ?
    `, [
        dados.nome,
        dados.tipoInstituicao,
        dados.outroTipo || null,
        dados.descricao,
        dados.responsavel,
        dados.telefone,
        dados.cep,
        dados.estado,
        dados.rua,
        dados.numero,
        dados.complemento || null,
        dados.bairro,
        dados.cidade,
        dados.pessoasAtendidas,
        dados.frequenciaDoacao,
        dados.alimentosNecessarios,
        dados.observacoes || null,
        id
    ]);

    return resultado.affectedRows;
}
