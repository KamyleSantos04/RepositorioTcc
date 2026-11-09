const BASE = 'http://localhost:3001';

const sufixo = Date.now();

async function chamar(metodo, caminho, corpo, token) {
    const resposta = await fetch(`${BASE}${caminho}`, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        ...(corpo ? { body: JSON.stringify(corpo) } : {})
    });

    const texto = await resposta.text();
    let dados;
    try {
        dados = JSON.parse(texto);
    } catch {
        dados = texto;
    }

    return { status: resposta.status, dados };
}

function mostrar(rotulo, resultado) {
    console.log(`${rotulo} -> ${resultado.status} :: ${JSON.stringify(resultado.dados)}`);
}

async function main() {
    const ongEmail = `ong${sufixo}@teste.com`;
    const estabEmail = `estab${sufixo}@teste.com`;
    const senha = 'senha123';

    const cadastroOng = await chamar('POST', '/api/auth/cadastro/ong', {
        nome: 'ONG Teste',
        tipoInstituicao: 'ong',
        cnpj: `11.111.111/0001-${String(sufixo).slice(-2)}`,
        descricao: 'Instituição de teste automatizado',
        responsavel: 'Responsável ONG',
        telefone: '11999999999',
        email: ongEmail,
        senha,
        cep: '01001000',
        estado: 'SP',
        rua: 'Rua Teste',
        numero: '100',
        bairro: 'Centro',
        cidade: 'São Paulo',
        pessoasAtendidas: 120,
        frequenciaDoacao: 'semanal',
        alimentosNecessarios: 'arroz, feijão, leite'
    });
    mostrar('Cadastro ONG', cadastroOng);

    const cadastroEstab = await chamar(
        'POST',
        '/api/auth/cadastro/estabelecimento',
        {
            nome: 'Padaria Teste',
            tipoEstabelecimento: 'padaria',
            cnpj: `22.222.222/0001-${String(sufixo).slice(-2)}`,
            telefone: '11888888888',
            email: estabEmail,
            senha,
            cep: '02002000',
            rua: 'Rua Padaria',
            numero: '200',
            bairro: 'Vila',
            cidade: 'São Paulo',
            estado: 'SP',
            responsavel: 'Responsável Padaria',
            cpfResponsavel: '123.456.789-00',
            cargoResponsavel: 'Gerente'
        }
    );
    mostrar('Cadastro Estabelecimento', cadastroEstab);

    const loginOng = await chamar('POST', '/api/auth/login', {
        email: ongEmail,
        senha
    });
    mostrar('Login ONG', loginOng);

    const loginEstab = await chamar('POST', '/api/auth/login', {
        email: estabEmail,
        senha
    });
    mostrar('Login Estabelecimento', loginEstab);

    const tokenOng = loginOng.dados.token;
    const tokenEstab = loginEstab.dados.token;

    mostrar(
        'Meu estabelecimento',
        await chamar('GET', '/api/meu-estabelecimento', null, tokenEstab)
    );

    mostrar(
        'Minha instituição',
        await chamar('GET', '/api/minha-instituicao', null, tokenOng)
    );

    const criarDoacao = await chamar(
        'POST',
        '/api/doacoes',
        {
            nomeAlimento: 'Pães franceses',
            categoria: 'Padaria',
            quantidade: 30,
            unidade: 'Unidades',
            validade: '2026-12-01',
            retiradaAte: '2026-12-01 16:30:00',
            enderecoRetirada: 'Rua Padaria, 200 - São Paulo/SP',
            observacoes: 'Retirar até as 16h30'
        },
        tokenEstab
    );
    mostrar('Criar doação', criarDoacao);

    const doacaoId = criarDoacao.dados.id;

    mostrar(
        'Doações disponíveis',
        await chamar('GET', '/api/doacoes')
    );

    const solicitar = await chamar(
        'POST',
        '/api/solicitacoes',
        { doacaoId, mensagem: 'Podemos retirar hoje' },
        tokenOng
    );
    mostrar('Solicitar doação', solicitar);

    mostrar(
        'Solicitar duplicado (deve dar 409)',
        await chamar('POST', '/api/solicitacoes', { doacaoId }, tokenOng)
    );

    mostrar(
        'Solicitações recebidas',
        await chamar('GET', '/api/solicitacoes-recebidas', null, tokenEstab)
    );

    const solicitacaoId = solicitar.dados.id;

    mostrar(
        'Aceitar solicitação',
        await chamar(
            'PUT',
            `/api/solicitacoes/${solicitacaoId}/status`,
            { status: 'ACEITA' },
            tokenEstab
        )
    );

    mostrar(
        'Minhas solicitações (ONG)',
        await chamar('GET', '/api/minhas-solicitacoes', null, tokenOng)
    );

    mostrar(
        'Concluir retirada (ONG)',
        await chamar(
            'PUT',
            `/api/solicitacoes/${solicitacaoId}/concluir`,
            {},
            tokenOng
        )
    );

    mostrar(
        'Resumo ONG',
        await chamar('GET', '/api/solicitacoes/resumo', null, tokenOng)
    );

    mostrar(
        'Resumo Estabelecimento',
        await chamar('GET', '/api/doacoes/resumo', null, tokenEstab)
    );

    mostrar(
        'Minhas doações',
        await chamar('GET', '/api/minhas-doacoes', null, tokenEstab)
    );

    mostrar(
        'Acesso indevido (ONG em rota de estabelecimento)',
        await chamar('GET', '/api/doacoes/resumo', null, tokenOng)
    );

    mostrar(
        'Sem token (deve dar 401)',
        await chamar('GET', '/api/meu-estabelecimento')
    );
}

main().catch((erro) => {
    console.error('FALHA NO TESTE:', erro);
    process.exit(1);
});
