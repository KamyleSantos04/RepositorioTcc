import { Link, NavLink, useNavigate } from 'react-router-dom';
import { limparSessao, TIPO_ONG } from '../../lib/sessao';
import './index.scss';

const ITENS_ESTABELECIMENTO = [
    {
        para: '/DashEstabelecimento',
        rotulo: 'Início',
        icone: '/assets/icons/casa.png',
        exato: true
    },
    {
        para: '/CadastrarAlimento',
        rotulo: 'Cadastrar alimento',
        icone: '/assets/icons/doar.png'
    },
    {
        para: '/MinhasDoacoes',
        rotulo: 'Minhas doações',
        icone: '/assets/icons/cesta.png'
    },
    {
        para: '/Solicitacoes',
        rotulo: 'Solicitações',
        icone: '/assets/icons/doar.png'
    },
    {
        para: '/Historico',
        rotulo: 'Histórico',
        icone: '/assets/icons/historico.png'
    },
    {
        para: '/MeusEstabelecimentos',
        rotulo: 'Meus estabelecimentos',
        icone: '/assets/icons/estabelecimento.png'
    },
    {
        para: '/PerfilEstabelecimento',
        rotulo: 'Perfil',
        icone: '/assets/icons/users.png'
    },
    {
        para: '/Configuracao',
        rotulo: 'Configuração',
        icone: '/assets/icons/conf.png'
    }
];

const ITENS_ONG = [
    { para: '/DashONG', rotulo: 'Início', exato: true },
    { para: '/DashONG/BuscarDoacoes', rotulo: 'Buscar Doações' },
    { para: '/DashONG/Solicitacoes', rotulo: 'Solicitações' },
    { para: '/DashONG/Recebimentos', rotulo: 'Recebimentos' },
    { para: '/DashONG/Historico', rotulo: 'Histórico' },
    { para: '/DashONG/Perfil', rotulo: 'Perfil' }
];

function Logo({ classe }) {
    return (
        <Link to="/" className={classe} title="Página inicial do site">
            <img src="/assets/images/logo.png" alt="Conecta-Alimento" />
        </Link>
    );
}

function BotaoSair({ classe }) {
    const navegar = useNavigate();

    function sair() {
        limparSessao();
        navegar('/Entrar', { replace: true });
    }

    return (
        <button type="button" className={classe} onClick={sair}>
            <img
                src="/assets/icons/arrow-right-from-bracket-solid.png"
                alt=""
            />
            <span>Sair</span>
        </button>
    );
}

function NavegacaoLateral() {
    return (
        <aside className="dash-lateral">
            <Logo classe="dash-lateral-logo" />

            <nav className="dash-lateral-itens">
                {ITENS_ESTABELECIMENTO.map((item) => (
                    <NavLink
                        key={item.para}
                        to={item.para}
                        end={item.exato}
                        className={({ isActive }) =>
                            isActive
                                ? 'dash-lateral-item ativo'
                                : 'dash-lateral-item'
                        }
                    >
                        <img src={item.icone} alt="" />
                        <h1>{item.rotulo}</h1>
                    </NavLink>
                ))}

                <BotaoSair classe="dash-lateral-sair" />
            </nav>
        </aside>
    );
}

function NavegacaoTopo() {
    return (
        <>
            <header className="dash-topo">
                <Logo classe="dash-topo-logo" />

                <nav className="dash-topo-itens">
                    {ITENS_ONG.map((item) => (
                        <NavLink
                            key={item.para}
                            to={item.para}
                            end={item.exato}
                            className={({ isActive }) =>
                                isActive
                                    ? 'dash-topo-item ativo'
                                    : 'dash-topo-item'
                            }
                        >
                            {item.rotulo}
                        </NavLink>
                    ))}
                </nav>
            </header>

            <div className="dash-topo-sair-linha">
                <BotaoSair classe="dash-topo-sair" />
            </div>
        </>
    );
}

/**
 * Estrutura comum dos dashboards.
 *
 * - tipo="ESTABELECIMENTO": faixa verde lateral (padrão já usado no
 *   dashboard do estabelecimento).
 * - tipo="ONG": faixa verde no topo, com o botão Sair logo abaixo.
 */
export default function LayoutDashboard({ tipo, children }) {
    const ehOng = tipo === TIPO_ONG;

    return (
        <div className={ehOng ? 'dash dash-topo-var' : 'dash'}>
            {ehOng ? <NavegacaoTopo /> : <NavegacaoLateral />}

            <main className="dash-conteudo">{children}</main>
        </div>
    );
}
