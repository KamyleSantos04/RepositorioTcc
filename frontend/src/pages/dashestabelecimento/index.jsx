import './index.scss';
import { Link } from 'react-router-dom';

const nomeEstabelecimento =
  sessionStorage.getItem('nomeContaConectaAlimento') || 'Estabelecimento';

export default function Dashboard() {
  function sair() {
    sessionStorage.removeItem('nomeContaConectaAlimento');
    window.location.href = '/Entrar';
  }

  return (
    <div className="pai">

      <aside className="menu">
        <Link to="/DashEstabelecimento">
          <img
            src="/assets/images/logo.png"
            alt="Conecta-Alimento"
            className="alimento"
          />
        </Link>

        <nav className="icones">

          <Link to="/DashEstabelecimento" className="item-menu">
            <img src="/assets/icons/casa.png" alt="" />
            <h1>Início</h1>
          </Link>

          <Link to="/MinhasDoacoes" className="item-menu">
            <img src="/assets/icons/cesta.png" alt="" />
            <h1>Minhas doações</h1>
          </Link>

          <Link to="/Solicitacoes" className="item-menu">
            <img src="/assets/icons/doar.png" alt="" />
            <h1>Solicitações</h1>
          </Link>

          <Link to="/Historico" className="item-menu">
            <img src="/assets/icons/historico.png" alt="" />
            <h1>Histórico</h1>
          </Link>

          <Link to="/MeusEstabelecimentos" className="item-menu">
            <img src="/assets/icons/estabelecimento.png" alt="" />
            <h1>Meus estabelecimentos</h1>
          </Link>

          <Link to="/Configuracao" className="item-menu">
            <img src="/assets/icons/conf.png" alt="" />
            <h1>Configuração</h1>
          </Link>

          <button type="button" className="item-menu-sair" onClick={sair}>
            <img src="/assets/icons/sair.png" alt="" />
            <h1>Sair</h1>
          </button>

        </nav>
      </aside>

      <main className="ola">

        <header className="titulo">
          <h1>Bem-vindo, {nomeEstabelecimento}!</h1>
          <p>Aqui está um resumo das suas atividades.</p>
        </header>

        <section className="tabela">

          <Link to="/MinhasDoacoes" className="cubo doacoes card-link">
            <h2>12</h2>
            <p>Doações ativas</p>
          </Link>

          <Link to="/Solicitacoes" className="cubo solicitacoes card-link">
            <h2>8</h2>
            <p>Solicitações recebidas</p>
          </Link>

          <Link to="/Historico" className="cubo concluidas card-link">
            <h2>27</h2>
            <p>Doações concluídas</p>
          </Link>

          <Link to="/Historico" className="cubo alimentos card-link">
            <h2>438 kg</h2>
            <p>Alimentos destinados</p>
          </Link>

        </section>

        <section className="tabeladois">

          <div className="doacoes-recentes">

            <div className="cabecalho-doacoes">
              <h2>Doações recentes</h2>
              <Link to="/MinhasDoacoes">Ver todas</Link>
            </div>

            <div className="lista-doacoes">

              <Link to="/MinhasDoacoes" className="item-doacao">
                <img
                  src="/assets/images/images.jpg"
                  alt="Pães franceses"
                />

                <div className="info-doacao">
                  <h3>Pães franceses</h3>
                  <p>30 unidades · Retirada até 16:30</p>
                </div>

                <span className="status ativa">Ativa</span>
              </Link>

              <Link to="/MinhasDoacoes" className="item-doacao">
                <img
                  src="/assets/images/frtvrds.jpg"
                  alt="Frutas variadas"
                />

                <div className="info-doacao">
                  <h3>Frutas variadas</h3>
                  <p>15 kg · Retirada até 16:00</p>
                </div>

                <span className="status solicitada">Solicitada</span>
              </Link>

              <Link to="/MinhasDoacoes" className="item-doacao">
                <img
                  src="/assets/images/cmdprt.jpg"
                  alt="Refeições prontas"
                />

                <div className="info-doacao">
                  <h3>Refeições prontas</h3>
                  <p>50 unidades · Retirada até 12:00</p>
                </div>

                <span className="status confirmada">Confirmada</span>
              </Link>

            </div>
          </div>

          <div className="seu-impacto">

            <h2>Seu impacto</h2>

            <div className="grafico-impacto">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <h3>72%</h3>

            <p>
              dos seus excedentes
              <br />
              foram destinados.
            </p>

            <Link to="/Historico">Ver relatório completo</Link>

          </div>

        </section>

      </main>
    </div>
  );
}