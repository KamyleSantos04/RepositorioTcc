import { con } from '../database.js';

export async function listarInstituicoes(busca = '') {
    const termo = `%${busca}%`;
    const [linhas] = await con.query(`
        select i.id, i.nome, i.tipo_instituicao, i.descricao, i.cidade, i.estado,
               i.pessoas_atendidas, i.frequencia_doacao, i.alimentos_necessarios
          from instituicoes i
         where i.nome like ? or i.cidade like ? or i.alimentos_necessarios like ?
         order by i.nome
    `, [termo, termo, termo]);
    return linhas;
}
