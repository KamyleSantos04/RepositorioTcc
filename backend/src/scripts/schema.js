import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';

config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

const { con } = await import('../database.js');

const TABELAS = ['doacoes13', 'solicitacoes13'];

const [tabelas] = await con.query('show tables');
console.log('--- TABELAS NO BANCO ---');
console.log(JSON.stringify(tabelas, null, 2));

for (const tabela of TABELAS) {
    try {
        const [colunas] = await con.query(`describe ${tabela}`);
        console.log(`\n--- ${tabela} ---`);
        for (const coluna of colunas) {
            console.log(
                `${coluna.Field} | ${coluna.Type} | null=${coluna.Null} | key=${coluna.Key} | default=${coluna.Default}`
            );
        }
    } catch (erro) {
        console.log(`\n--- ${tabela} --- NAO EXISTE (${erro.code})`);
    }
}

await con.end();
