import { Router } from 'express';
import * as dbDoacao from '../repository/doacaoRepository.js';
import { autenticar, permitirTipo } from '../middleware/autenticar.js';

const endpoints = Router();

const STATUS_PERMITIDOS = ['DISPONIVEL', 'RESERVADA', 'CONCLUIDA', 'CANCELADA'];

endpoints.get('/api/doacoes', async (req, res) => {
    try {
        const doacoes = await dbDoacao.listarDisponiveis(req.query.busca || '');
        res.status(200).json(doacoes);
    } catch (erro) {
        console.error('Erro ao listar doações:', erro.message);
        res.status(500).json({ erro: 'Não foi possível listar as doações.' });
    }
});

endpoints.post(
    '/api/doacoes',
    autenticar,
    permitirTipo('ESTABELECIMENTO'),
    async (req, res) => {
        const dados = req.body;
        const obrigatorios = {
            nomeAlimento: 'nome do alimento',
            quantidade: 'quantidade',
            unidade: 'unidade',
            enderecoRetirada: 'local de retirada'
        };

        const faltando = Object.entries(obrigatorios)
            .filter(([campo]) => {
                const valor = dados[campo];
                return valor === undefined || valor === null || String(valor).trim() === '';
            })
            .map(([, nome]) => nome);

        if (faltando.length) {
            return res.status(400).json({
                erro: `Preencha os campos: ${faltando.join(', ')}.`
            });
        }

        const quantidade = Number(dados.quantidade);
        if (!Number.isFinite(quantidade) || quantidade <= 0) {
            return res.status(400).json({
                erro: 'A quantidade precisa ser um número maior que zero.'
            });
        }

        try {
            const id = await dbDoacao.criarDoacao(
                { ...dados, quantidade },
                req.usuario.perfilId
            );
            res.status(201).json({
                id,
                mensagem: 'Doação cadastrada com sucesso!'
            });
        } catch (erro) {
            console.error('Erro ao cadastrar doação:', erro.message);
            res.status(500).json({
                erro: 'Não foi possível cadastrar a doação.'
            });
        }
    }
);

endpoints.get(
    '/api/minhas-doacoes',
    autenticar,
    permitirTipo('ESTABELECIMENTO'),
    async (req, res) => {
        try {
            res.json(await dbDoacao.listarMinhasDoacoes(req.usuario.perfilId));
        } catch (erro) {
            console.error('Erro ao listar minhas doações:', erro.message);
            res.status(500).json({
                erro: 'Não foi possível carregar suas doações.'
            });
        }
    }
);

endpoints.get(
    '/api/doacoes/resumo',
    autenticar,
    permitirTipo('ESTABELECIMENTO'),
    async (req, res) => {
        try {
            res.json(await dbDoacao.resumoEstabelecimento(req.usuario.perfilId));
        } catch (erro) {
            console.error('Erro ao resumir doações:', erro.message);
            res.status(500).json({
                erro: 'Não foi possível carregar o resumo das doações.'
            });
        }
    }
);

endpoints.put(
    '/api/doacoes/:id/status',
    autenticar,
    permitirTipo('ESTABELECIMENTO'),
    async (req, res) => {
        const status = String(req.body.status || '').toUpperCase();

        if (!STATUS_PERMITIDOS.includes(status)) {
            return res.status(400).json({
                erro: `O status precisa ser um destes: ${STATUS_PERMITIDOS.join(', ')}.`
            });
        }

        try {
            const qtd = await dbDoacao.atualizarStatus(
                req.params.id,
                req.usuario.perfilId,
                status
            );

            if (qtd === -1) {
                return res.status(409).json({
                    erro: 'Esta doação já foi destinada a uma instituição e não pode voltar a ficar disponível.'
                });
            }

            if (!qtd) {
                return res.status(404).json({
                    erro: 'Doação não encontrada para este estabelecimento.'
                });
            }

            res.json({ qtd, mensagem: 'Doação atualizada com sucesso!' });
        } catch (erro) {
            console.error('Erro ao atualizar doação:', erro.message);
            res.status(500).json({
                erro: 'Não foi possível atualizar a doação.'
            });
        }
    }
);

endpoints.delete(
    '/api/doacoes/:id',
    autenticar,
    permitirTipo('ESTABELECIMENTO'),
    async (req, res) => {
        try {
            const qtd = await dbDoacao.removerDoacao(
                req.params.id,
                req.usuario.perfilId
            );

            if (!qtd) {
                return res.status(404).json({
                    erro: 'Doação não encontrada para este estabelecimento.'
                });
            }

            res.json({ qtd, mensagem: 'Doação removida com sucesso!' });
        } catch (erro) {
            console.error('Erro ao remover doação:', erro.message);
            res.status(500).json({
                erro: 'Não foi possível remover a doação. Ela pode ter solicitações vinculadas.'
            });
        }
    }
);

export default endpoints;
