import { Router } from 'express';
import * as dbDoacao from '../repository/doacaoRepository.js';
import { autenticar, permitirTipo } from '../middleware/autenticar.js';

const endpoints = Router();

endpoints.get('/api/doacoes', async (req, res) => {
    try {
        const doacoes = await dbDoacao.listarDisponiveis(req.query.busca || '');
        res.status(200).json(doacoes);
    } catch (erro) {
        console.error('Erro ao listar doações:', erro.message);
        res.status(500).json({ erro: 'Não foi possível listar as doações.' });
    }
});

endpoints.post('/api/doacoes', autenticar, permitirTipo('ESTABELECIMENTO'), async (req, res) => {
    const dados = req.body;
    if (!dados.nomeAlimento || !dados.quantidade || !dados.unidade || !dados.enderecoRetirada) {
        return res.status(400).json({ erro: 'Informe alimento, quantidade, unidade e endereço de retirada.' });
    }
    try {
        const id = await dbDoacao.criarDoacao(dados, req.usuario.perfilId);
        res.status(201).json({ id, mensagem: 'Doação cadastrada com sucesso!' });
    } catch (erro) {
        console.error('Erro ao cadastrar doação:', erro.message);
        res.status(500).json({ erro: 'Não foi possível cadastrar a doação.' });
    }
});

endpoints.get('/api/minhas-doacoes', autenticar, permitirTipo('ESTABELECIMENTO'), async (req, res) => {
    try {
        res.json(await dbDoacao.listarMinhasDoacoes(req.usuario.perfilId));
    } catch (erro) {
        res.status(500).json({ erro: 'Não foi possível carregar suas doações.' });
    }
});

export default endpoints;
