import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { lerSessao, rotaLogin, sessaoValida } from '../lib/sessao';

/**
 * Protege uma página do dashboard.
 *
 * - Sem sessão: manda para o login guardando a página desejada em
 *   `?destino=...`, para que o usuário volte a ela depois de entrar.
 * - Com sessão de outro tipo: manda para o dashboard correto.
 *
 * Retorna a sessão quando o acesso é permitido. Enquanto a verificação
 * acontece (ou quando houve redirecionamento) o retorno é `null` e a
 * página não deve ser renderizada.
 *
 * @param {string|null} tipoEsperado 'ONG', 'ESTABELECIMENTO' ou null
 *                                  (qualquer usuário autenticado).
 */
export default function useProtecao(tipoEsperado = null) {
    const navegar = useNavigate();
    const local = useLocation();
    const [sessao, setSessao] = useState(() => sessaoValida(tipoEsperado));

    useEffect(() => {
        const atual = lerSessao();

        if (!atual) {
            setSessao(null);
            navegar(rotaLogin(local.pathname), { replace: true });
            return;
        }

        if (tipoEsperado && atual.tipo !== tipoEsperado) {
            setSessao(null);
            navegar(
                atual.tipo === 'ONG' ? '/DashONG' : '/DashEstabelecimento',
                { replace: true }
            );
            return;
        }

        setSessao(atual);
    }, [tipoEsperado, navegar, local.pathname]);

    return sessao;
}
