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
        para: '/Configuracao',
        rotulo: 'Configuração',
        icone: '/assets/icons/conf.png'
    }
];

const ITENS_ONG = [
    {
        para: '/DashONG',
        rotulo: 'Início',
        icone: '/assets/icons/casa.png',
        exato: true
    },
    {
        para: '/DashONG/BuscarDoacoes',
        rotulo: 'Buscar doações',
        icone: '/assets/icons/cesta.png'
    },
    {
        para: '/DashONG/Solicitacoes',
        rotulo: 'Solicitações',
        icone: '/assets/icons/doar.png'
    },
    {
        para: '/DashONG/Recebimentos',
        rotulo: 'Recebimentos',
        icone: '/assets/icons/inbox.png'
    },
    {
        para: '/DashONG/Historico',
        rotulo: 'Histórico',
        icone: '/assets/icons/historico.png'
    },
    {
        para: '/DashONG/Perfil',
        rotulo: 'Perfil',
        icone: '/assets/icons/perfil.png'
    }
];

function Logo({ classe }) {
    return (
        <Link to="/" className={classe} title="Página inicial do site">
            <img src="/assets/images/logobranca.png" alt="Conecta-Alimento" />
        </Link>
    );
}

function BotaoSair({ classe }) {
    const navegar = useNavigate();

    function sair() {
        limparSessao();
        navegar('/', { replace: true });
    }

    return (
        <button type="button" className={classe} onClick={sair}>
            <img
                src="/assets/icons/arrow-right-from-bracket-solid.png"
                alt=""
            />
            <Link 
            style={{ textDecoration: "none" }}
            to='/'><span>Sair</span></Link>
        </button>
    );
}

function NavegacaoLateral({ tipo }) {
    const ehOng = tipo === TIPO_ONG;
    const itens = ehOng ? ITENS_ONG : ITENS_ESTABELECIMENTO;

    return (
        <aside className={ehOng ? 'dash-lateral dash-lateral-ong' : 'dash-lateral'}>
            <Logo classe="dash-lateral-logo" />

            <nav className="dash-lateral-itens">
                {itens.map((item) => (
                    <NavLink
                    style={{ textDecoration: "none" }}
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

                <BotaoSair 
                classe="dash-lateral-sair" />
            </nav>
        </aside>
    );
}

export default function LayoutDashboard({ tipo, children }) {
    return (
        <div className="dash">
            <NavegacaoLateral tipo={tipo} />
            <main className="dash-conteudo">{children}</main>
        </div>
    );
}
