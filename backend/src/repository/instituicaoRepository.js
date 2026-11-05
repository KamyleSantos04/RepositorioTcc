
import { con } from '../database.js';

export async function listarInstituicoes(busca = '') {
    const termo = `%${busca}%`;

    const [linhas] = await con.query(`
        SELECT
            id,
            nome,
            tipo_instituicao,
            descricao,
            cidade,
            estado,
            pessoas_atendidas,
            frequencia_doacao,
            alimentos_necessarios
        FROM instituicoes13
        WHERE nome LIKE ?
           OR cidade LIKE ?
           OR alimentos_necessarios LIKE ?
        ORDER BY nome
    `, [termo, termo, termo]);

    return linhas;
}
