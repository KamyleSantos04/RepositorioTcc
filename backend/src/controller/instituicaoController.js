
import { Router } from 'express';
import * as dbInstituicao from '../repository/instituicaoRepository.js';
import { con } from '../database.js';
import { autenticar } from '../middleware/autenticar.js';

const endpoints = Router();

endpoints.get('/api/instituicoes', async (req, res) => {
    try {
        const instituicoes = await dbInstituicao.listarInstituicoes(
            req.query.busca || ''
        );

        res.status(200).json(instituicoes);
    } catch (erro) {
        console.error('Erro ao listar instituições:', erro);

        res.status(500).json({
            erro: 'Não foi possível listar as instituições.'
        });
    }
});

endpoints.get('/api/minha-instituicao', autenticar, async (req, res) => {
    if (req.usuario.tipo !== 'ONG') {
        return res.status(403).json({
            erro: 'Apenas contas de ONG podem acessar esta página.'
        });
    }

    try {
        const [linhas] = await con.query(
            'SELECT * FROM instituicoes13 WHERE id = ?',
            [req.usuario.perfilId]
        );

        if (!linhas[0]) {
            return res.status(404).json({
                erro: 'Instituição não encontrada.'
            });
        }

        res.status(200).json(linhas[0]);
    } catch (erro) {
        console.error('Erro ao carregar instituição:', erro);

        res.status(500).json({
            erro: 'Não foi possível carregar a instituição.'
        });
    }
});

export default endpoints;
