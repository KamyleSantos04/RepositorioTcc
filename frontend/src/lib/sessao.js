/**
 * Sessão do Conecta-Alimento.
 *
 * O token JWT e o tipo da conta ficam no sessionStorage, que é o
 * armazenamento já utilizado pelo projeto. Todas as chaves abaixo são
 * as mesmas usadas pelas páginas antigas (login, cadastro e dashboards).
 */

export const TIPO_ONG = 'ONG';
export const TIPO_ESTABELECIMENTO = 'ESTABELECIMENTO';

export const ROTA_LOGIN = '/Entrar';
export const ROTA_INICIAL_ONG = '/DashONG';
export const ROTA_INICIAL_ESTABELECIMENTO = '/DashEstabelecimento';

const CHAVE_TOKEN = 'tokenConectaAlimento';
const CHAVE_TIPO = 'tipoContaConectaAlimento';
const CHAVE_PERFIL = 'perfilId';
const CHAVE_NOME = 'nomeContaConectaAlimento';

export function salvarSessao(login) {
    sessionStorage.setItem(CHAVE_TOKEN, login.token);
    sessionStorage.setItem(CHAVE_TIPO, login.tipo);
    sessionStorage.setItem(CHAVE_PERFIL, String(login.perfilId ?? ''));
    sessionStorage.setItem(CHAVE_NOME, login.nome || '');
}

export function atualizarNomeDaSessao(nome) {
    sessionStorage.setItem(CHAVE_NOME, nome || '');
}

export function lerSessao() {
    const token = sessionStorage.getItem(CHAVE_TOKEN);

    if (!token) {
        return null;
    }

    return {
        token,
        tipo: sessionStorage.getItem(CHAVE_TIPO),
        perfilId: sessionStorage.getItem(CHAVE_PERFIL),
        nome: sessionStorage.getItem(CHAVE_NOME) || ''
    };
}

export function limparSessao() {
    sessionStorage.removeItem(CHAVE_TOKEN);
    sessionStorage.removeItem(CHAVE_TIPO);
    sessionStorage.removeItem(CHAVE_PERFIL);
    sessionStorage.removeItem(CHAVE_NOME);
}

/** Sessão válida e, opcionalmente, do tipo informado. */
export function sessaoValida(tipoEsperado) {
    const sessao = lerSessao();

    if (!sessao) return null;
    if (tipoEsperado && sessao.tipo !== tipoEsperado) return null;

    return sessao;
}

export function rotaInicial(tipo) {
    return tipo === TIPO_ONG
        ? ROTA_INICIAL_ONG
        : ROTA_INICIAL_ESTABELECIMENTO;
}

/**
 * Destino do botão escolhido na página inicial.
 * "doar"     -> cadastro de alimento (estabelecimento)
 * "receber"  -> busca de doações (ONG/instituição)
 */
export function rotaPorOrigem(origem) {
    if (origem === 'doar') return '/CadastrarAlimento';
    if (origem === 'receber') return `${ROTA_INICIAL_ONG}/BuscarDoacoes`;
    return null;
}

export function tipoPorOrigem(origem) {
    if (origem === 'doar') return TIPO_ESTABELECIMENTO;
    if (origem === 'receber') return TIPO_ONG;
    return null;
}

/** Monta a URL de login preservando o destino desejado. */
export function rotaLogin(destino, origem) {
    const parametros = new URLSearchParams();

    if (destino) parametros.set('destino', destino);
    if (origem) parametros.set('origem', origem);

    const consulta = parametros.toString();
    return consulta ? `${ROTA_LOGIN}?${consulta}` : ROTA_LOGIN;
}
