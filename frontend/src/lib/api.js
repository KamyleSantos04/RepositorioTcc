const URL_API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export class ErroApi extends Error {
    constructor(mensagem, status, dados) {
        super(mensagem);
        this.name = 'ErroApi';
        this.status = status;
        this.dados = dados;
    }
}

function lerToken() {
    return sessionStorage.getItem('tokenConectaAlimento');
}

export async function requisitar(caminho, opcoes = {}) {
    const token = lerToken();

    const cabecalhos = {
        ...(opcoes.corpo ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opcoes.cabecalhos
    };

    let resposta;

    try {
        resposta = await fetch(`${URL_API}${caminho}`, {
            method: opcoes.metodo || 'GET',
            headers: cabecalhos,
            ...(opcoes.corpo ? { body: JSON.stringify(opcoes.corpo) } : {})
        });
    } catch {
        throw new ErroApi(
            'Não foi possível conectar ao servidor. Confira se a API está rodando na porta 3001.',
            0,
            null
        );
    }

    const texto = await resposta.text();
    let dados = null;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            dados = texto;
        }
    }

    if (!resposta.ok) {
        const mensagem =
            (dados && (dados.erro || dados.mensagem)) ||
            'Não foi possível concluir a operação.';
        throw new ErroApi(mensagem, resposta.status, dados);
    }

    return dados;
}

export const api = {
    login: (email, senha) =>
        requisitar('/api/auth/login', {
            metodo: 'POST',
            corpo: { email, senha }
        }),

    cadastrarOng: (dados) =>
        requisitar('/api/auth/cadastro/ong', {
            metodo: 'POST',
            corpo: dados
        }),

    cadastrarEstabelecimento: (dados) =>
        requisitar('/api/auth/cadastro/estabelecimento', {
            metodo: 'POST',
            corpo: dados
        }),

    listarDoacoesDisponiveis: (busca = '') =>
        requisitar(`/api/doacoes${busca ? `?busca=${encodeURIComponent(busca)}` : ''}`),

    minhasDoacoes: () => requisitar('/api/minhas-doacoes'),

    resumoDoacoes: () => requisitar('/api/doacoes/resumo'),

    criarDoacao: (dados) =>
        requisitar('/api/doacoes', { metodo: 'POST', corpo: dados }),

    atualizarStatusDoacao: (id, status) =>
        requisitar(`/api/doacoes/${id}/status`, {
            metodo: 'PUT',
            corpo: { status }
        }),

    removerDoacao: (id) =>
        requisitar(`/api/doacoes/${id}`, { metodo: 'DELETE' }),

    solicitarDoacao: (doacaoId, mensagem) =>
        requisitar('/api/solicitacoes', {
            metodo: 'POST',
            corpo: { doacaoId, mensagem }
        }),

    minhasSolicitacoes: () => requisitar('/api/minhas-solicitacoes'),

    resumoSolicitacoes: () => requisitar('/api/solicitacoes/resumo'),

    solicitacoesRecebidas: () => requisitar('/api/solicitacoes-recebidas'),

    responderSolicitacao: (id, status) =>
        requisitar(`/api/solicitacoes/${id}/status`, {
            metodo: 'PUT',
            corpo: { status }
        }),

    concluirSolicitacao: (id) =>
        requisitar(`/api/solicitacoes/${id}/concluir`, { metodo: 'PUT' }),

    minhaInstituicao: () => requisitar('/api/minha-instituicao'),

    atualizarInstituicao: (dados) =>
        requisitar('/api/minha-instituicao', { metodo: 'PUT', corpo: dados }),

    meuEstabelecimento: () => requisitar('/api/meu-estabelecimento'),

    atualizarEstabelecimento: (dados) =>
        requisitar('/api/meu-estabelecimento', { metodo: 'PUT', corpo: dados }),

    listarInstituicoes: (busca = '') =>
        requisitar(`/api/instituicoes${busca ? `?busca=${encodeURIComponent(busca)}` : ''}`)
};
