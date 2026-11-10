import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as dbUsuario from '../repository/usuarioRepository.js';
import { con } from '../database.js';

const endpoints = Router();

function validarCampos(res, campos) {
    const faltando = campos.filter((campo) => campo.valor === undefined || campo.valor === null || String(campo.valor).trim() === '');
    if (faltando.length > 0) {
        res.status(400).json({ erro: `Preencha os campos: ${faltando.map((c) => c.nome).join(', ')}.` });
        return false;
    }
    return true;
}

async function cadastrar(req, res, tipo) {
    const dados = req.body;
    const camposComuns = [
        { nome: 'e-mail', valor: dados.email },
        { nome: 'senha', valor: dados.senha },
        { nome: 'nome', valor: dados.nome },
        { nome: 'CNPJ', valor: dados.cnpj },
        { nome: 'telefone', valor: dados.telefone },
        { nome: 'CEP', valor: dados.cep },
        { nome: 'rua', valor: dados.rua },
        { nome: 'número', valor: dados.numero },
        { nome: 'bairro', valor: dados.bairro },
        { nome: 'cidade', valor: dados.cidade },
        { nome: 'estado', valor: dados.estado },
        { nome: 'responsável', valor: dados.responsavel }
    ];
    const camposOng = [
        { nome: 'tipo de instituição', valor: dados.tipoInstituicao },
        { nome: 'descrição', valor: dados.descricao },
        { nome: 'pessoas atendidas', valor: dados.pessoasAtendidas },
        { nome: 'frequência de doação', valor: dados.frequenciaDoacao },
        { nome: 'alimentos necessários', valor: dados.alimentosNecessarios }
    ];
    const camposEstabelecimento = [
        { nome: 'tipo de estabelecimento', valor: dados.tipoEstabelecimento },
        { nome: 'CPF do responsável', valor: dados.cpfResponsavel },
        { nome: 'cargo do responsável', valor: dados.cargoResponsavel }
    ];

    if (!validarCampos(res, [...camposComuns, ...(tipo === 'ONG' ? camposOng : camposEstabelecimento)])) return;
    if (String(dados.senha).length < 6) {
        return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' });
    }

    try {
        const existente = await dbUsuario.buscarPorEmail(dados.email);
        if (existente) return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });

        const senhaHash = await bcrypt.hash(dados.senha, 10);
        const conexao = await con.getConnection();
        let usuarioId;
        let perfilId;

        try {
            await conexao.beginTransaction();
            usuarioId = await dbUsuario.criarUsuario(
                { email: dados.email.trim(), senhaHash, tipo },
                conexao
            );

            if (tipo === 'ONG') {
                perfilId = await dbUsuario.criarInstituicao(
                    { ...dados, usuarioId },
                    conexao
                );
            } else {
                perfilId = await dbUsuario.criarEstabelecimento(
                    { ...dados, usuarioId },
                    conexao
                );
            }

            await conexao.commit();
        } catch (erro) {
            await conexao.rollback();
            throw erro;
        } finally {
            conexao.release();
        }

        res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!', usuarioId, perfilId, tipo });
    } catch (erro) {
        console.error('Erro no cadastro:', erro.message);
        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ erro: 'Este e-mail ou CNPJ já está cadastrado.' });
        }
        res.status(500).json({ erro: 'Não foi possível concluir o cadastro.' });
    }
}

endpoints.post('/api/auth/cadastro/ong', (req, res) => cadastrar(req, res, 'ONG'));
endpoints.post('/api/auth/cadastro/estabelecimento', (req, res) => cadastrar(req, res, 'ESTABELECIMENTO'));

endpoints.post('/api/auth/login', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ erro: 'Informe e-mail e senha.' });

    try {
        const usuario = await dbUsuario.buscarPorEmail(email);
        if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash))) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
        }

        const perfil = await dbUsuario.buscarPerfil(usuario.id, usuario.tipo);
        if (!perfil) return res.status(404).json({ erro: 'Perfil da conta não encontrado.' });

        const token = jwt.sign(
            { id: usuario.id, tipo: usuario.tipo, perfilId: perfil.id },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            token,
            tipo: usuario.tipo,
            perfilId: perfil.id,
            nome: perfil.nome,
            dashboard: usuario.tipo === 'ONG' ? '/DashONG' : '/DashEstabelecimento'
        });
    } catch (erro) {
        console.error('Erro no login:', erro.message);
        res.status(500).json({ erro: 'Não foi possível realizar o login.' });
    }
});

export default endpoints;
