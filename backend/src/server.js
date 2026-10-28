
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import conexao from "./database.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001"
    ]
}));

app.use(express.json());

// verificar se a api está funcionando
app.get("/api/health", async (req, res) => {
    try {
        await conexao.query("select 1");

        res.status(200).json({
            mensagem: "API funcionando e banco conectado!"
        });
    } catch (erro) {
        console.error("Erro na conexão com o banco:", erro.message);

        res.status(500).json({
            erro: "Não foi possível conectar ao banco de dados."
        });
    }
});

// listar doações disponíveis
app.get("/api/doacoes", async (req, res) => {
    try {
        const [doacoes] = await conexao.execute(`
            select
                d.id,
                d.nome_alimento,
                d.categoria,
                d.quantidade,
                d.unidade,
                d.validade,
                d.retirada_ate,
                d.endereco_retirada,
                d.observacoes,
                d.status,
                e.nome_fantasia as estabelecimento,
                e.cidade,
                e.estado
            from doacoes d
            inner join estabelecimentos e
                on d.estabelecimento_id = e.id
            where d.status = 'disponivel'
            order by d.criado_em desc
        `);

        res.status(200).json(doacoes);
    } catch (erro) {
    console.error("Erro na conexão com o MySQL:", erro);

    res.status(500).json({
        erro: "Não foi possível conectar ao banco de dados.",
        detalhe: erro.message
    });
}
});

// verificar se o servidor está funcionando
app.get("/", (req, res) => {
    res.status(200).json({
        mensagem: "API Alimento que Conecta"
    });
});

const porta = process.env.PORT || 3001;

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});

