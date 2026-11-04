import { Router } from 'express';
import { con } from '../database.js';
import * as dbSolicitacao from '../repository/solicitacaoRepository.js';
import * as dbDoacao from '../repository/doacaoRepository.js';
import { autenticar, permitirTipo } from '../middleware/autenticar.js';

const endpoints = Router();

endpoints.post('/api/solicitacoes', autenticar, permitirTipo('ONG'), async (req, res) => {
    const { doacaoId, mensagem } = req.body;
    if (!doacaoId) return res.status(400).json({ erro: 'Informe qual doação deseja solicitar.' });

    try {
        const doacao = await dbDoacao.buscarDoacao(doacaoId);
        if (!doacao || doacao.status !== 'DISPONIVEL') {
            return res.status(404).json({ erro: 'Esta doação não está disponível.' });
        }
        const [existentes] = await con.query(
            'select id from solicitacoes where doacao_id = ? and instituicao_id = ? and status in (\'PENDENTE\', \'ACEITA\')',
            [doacaoId, req.usuario.perfilId]
        );
        if (existentes.length) return res.status(409).json({ erro: 'Sua instituição já solicitou esta doação.' });

        const id = await dbSolicitacao.criarSolicitacao(doacaoId, req.usuario.perfilId, mensagem);
        res.status(201).json({ id, mensagem: 'Solicitação enviada ao estabelecimento!' });
    } catch (erro) {
        console.error('Erro ao solicitar doação:', erro.message);
        res.status(500).json({ erro: 'Não foi possível enviar a solicitação.' });
    }
});

endpoints.get('/api/minhas-solicitacoes', autenticar, permitirTipo('ONG'), async (req, res) => {
    try {
        res.json(await dbSolicitacao.listarMinhasSolicitacoes(req.usuario.perfilId));
    } catch (erro) {
        res.status(500).json({ erro: 'Não foi possível carregar suas solicitações.' });
    }
});

endpoints.get('/api/solicitacoes-recebidas', autenticar, permitirTipo('ESTABELECIMENTO'), async (req, res) => {
    try {
        res.json(await dbSolicitacao.listarRecebidas(req.usuario.perfilId));
    } catch (erro) {
        res.status(500).json({ erro: 'Não foi possível carregar as solicitações recebidas.' });
    }
});

endpoints.put('/api/solicitacoes/:id/status', autenticar, permitirTipo('ESTABELECIMENTO'), async (req, res) => {
    const status = String(req.body.status || '').toUpperCase();
    if (!['ACEITA', 'RECUSADA'].includes(status)) {
        return res.status(400).json({ erro: 'O status precisa ser ACEITA ou RECUSADA.' });
    }
    try {
        const qtd = await dbSolicitacao.atualizarStatus(req.params.id, req.usuario.perfilId, status);
        if (!qtd) return res.status(404).json({ erro: 'Solicitação não encontrada para este estabelecimento.' });
        res.json({ qtd, mensagem: 'Solicitação atualizada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Não foi possível atualizar a solicitação.' });
    }
});

export default endpoints;
