import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { con } from './database.js';
import { addRoutes } from './routes.js';

const api = express();
api.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }));
api.use(express.json());

api.get('/', (req, res) => {
    res.json({ mensagem: 'API Alimento que Conecta' });
});

api.get('/api/health', async (req, res) => {
    try {
        await con.query('select 1');
        res.json({ mensagem: 'API funcionando e banco conectado!' });
    } catch (erro) {
        console.error('Erro ao conectar ao banco:', erro.message);
        res.status(500).json({ erro: 'API iniciou, mas não conseguiu conectar ao MySQL. Confira o arquivo .env e o script SQL.' });
    }
});

addRoutes(api);

api.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada.' });
});

const porta = process.env.PORT || 3001;
api.listen(porta, () => console.log(`API rodando em http://localhost:${porta}`));
