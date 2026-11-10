import { con } from '../database.js';

export async function buscarEstabelecimentoPorId(id) {
    const [linhas] = await con.query(`
        select e.*, u.email
          from estabelecimentos13 e
          join usuarios u on u.id = e.usuario_id
         where e.id = ?
    `, [id]);
    return linhas[0];
}

export async function atualizarEstabelecimento(id, dados) {
    const [resultado] = await con.query(`
        update estabelecimentos13
           set nome = ?,
               tipo_estabelecimento = ?,
               outro_tipo = ?,
               telefone = ?,
               cep = ?,
               rua = ?,
               numero = ?,
               complemento = ?,
               bairro = ?,
               cidade = ?,
               estado = ?,
               responsavel = ?,
               cpf_responsavel = ?,
               cargo_responsavel = ?
         where id = ?
    `, [
        dados.nome,
        dados.tipoEstabelecimento,
        dados.outroTipo || null,
        dados.telefone,
        dados.cep,
        dados.rua,
        dados.numero,
        dados.complemento || null,
        dados.bairro,
        dados.cidade,
        dados.estado,
        dados.responsavel,
        dados.cpfResponsavel,
        dados.cargoResponsavel,
        id
    ]);

    return resultado.affectedRows;
}
