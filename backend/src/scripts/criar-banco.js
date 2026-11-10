/**
 * Cria o banco e as tabelas do Conecta-Alimento.
 *
 * Uso: npm run banco --prefix backend
 *
 * O script lê o arquivo schema.sql ao lado dele e executa tudo.
 * Pode ser rodado quantas vezes for preciso: usa CREATE ... IF NOT EXISTS.
 */
import '../env.js';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const arquivoSchema = fileURLToPath(new URL('./schema.sql', import.meta.url));

async function principal() {
    const sql = await readFile(arquivoSchema, 'utf8');

    const conexao = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });

    try {
        await conexao.query(sql);
        console.log(
            `Banco "${process.env.DB_NAME || 'TCC13'}" criado/verificado com sucesso.`
        );
    } finally {
        await conexao.end();
    }
}

principal().catch((erro) => {
    console.error('Não foi possível criar o banco:', erro.message);
    console.error(
        'Confira DB_HOST, DB_PORT, DB_USER e DB_PASSWORD no arquivo backend/.env'
    );
    process.exit(1);
});
