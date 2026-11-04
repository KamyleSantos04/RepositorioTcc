import auth from './controller/authController.js';
import instituicoes from './controller/instituicaoController.js';
import doacoes from './controller/doacaoController.js';
import solicitacoes from './controller/solicitacaoController.js';

export function addRoutes(api) {
    api.use(auth);
    api.use(instituicoes);
    api.use(doacoes);
    api.use(solicitacoes);
}
