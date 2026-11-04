import { con } from '../database.js';

export async function buscarPorEmail(email) {
    const [linhas] = await con.query(
        'select id, email, senha_hash, tipo from usuarios where email = ?',
        [email]
    );
    return linhas[0];
}

export async function criarUsuario(usuario) {
    const [resultado] = await con.query(
        'insert into usuarios (email, senha_hash, tipo) values (?, ?, ?)',
        [usuario.email, usuario.senhaHash, usuario.tipo]
    );
    return resultado.insertId;
}

export async function criarInstituicao(dados) {
    const [resultado] = await con.query(`
        insert into instituicoes
        (usuario_id, nome, tipo_instituicao, outro_tipo, cnpj, descricao,
         responsavel, telefone, cep, estado, rua, numero, complemento, bairro,
         cidade, pessoas_atendidas, frequencia_doacao, alimentos_necessarios, observacoes)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        dados.usuarioId, dados.nome, dados.tipoInstituicao, dados.outroTipo || null,
        dados.cnpj, dados.descricao, dados.responsavel, dados.telefone, dados.cep,
        dados.estado, dados.rua, dados.numero, dados.complemento || null, dados.bairro,
        dados.cidade, dados.pessoasAtendidas, dados.frequenciaDoacao,
        dados.alimentosNecessarios, dados.observacoes || null
    ]);
    return resultado.insertId;
}

export async function criarEstabelecimento(dados) {
    const [resultado] = await con.query(`
        insert into estabelecimentos
        (usuario_id, nome, tipo_estabelecimento, outro_tipo, cnpj, telefone, cep,
         rua, numero, complemento, bairro, cidade, estado, responsavel,
         cpf_responsavel, cargo_responsavel)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        dados.usuarioId, dados.nome, dados.tipoEstabelecimento, dados.outroTipo || null,
        dados.cnpj, dados.telefone, dados.cep, dados.rua, dados.numero,
        dados.complemento || null, dados.bairro, dados.cidade, dados.estado,
        dados.responsavel, dados.cpfResponsavel, dados.cargoResponsavel
    ]);
    return resultado.insertId;
}

export async function buscarPerfil(id, tipo) {
    const tabela = tipo === 'ONG' ? 'instituicoes' : 'estabelecimentos';
    const [linhas] = await con.query(`select * from ${tabela} where usuario_id = ?`, [id]);
    return linhas[0];
}
