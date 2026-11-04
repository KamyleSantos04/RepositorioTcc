import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './index.scss';

export default function DashboardONG() {
  const navegar = useNavigate();
  const nome = sessionStorage.getItem('nomeContaConectaAlimento') || 'Sua instituição';

  useEffect(() => {
    if (!sessionStorage.getItem('tokenConectaAlimento') || sessionStorage.getItem('tipoContaConectaAlimento') !== 'ONG') {
      navegar('/Entrar');
    }
  }, [navegar]);

  function sair() {
    sessionStorage.removeItem('tokenConectaAlimento');
    sessionStorage.removeItem('tipoContaConectaAlimento');
    sessionStorage.removeItem('nomeContaConectaAlimento');
    navegar('/');
  }

  return (
    <main className="dashboard-ong">
      <aside className="dashboard-ong-menu">
        <Link to="/" className="dashboard-ong-logo"><img src="/assets/images/logo.png" alt="Alimento que Conecta" /></Link>
        <h2>Área da instituição</h2>
        <Link to="/DashONG">Início</Link>
        <Link to="/Doacoes">Procurar doações</Link>
        <Link to="/Instituicoes">Ver instituições</Link>
        <button onClick={sair}>Sair da conta</button>
      </aside>

      <section className="dashboard-ong-conteudo">
        <p className="dashboard-ong-etiqueta">DASHBOARD DA ONG</p>
        <h1>Olá, {nome}! 💚</h1>
        <p className="dashboard-ong-intro">Este é um exemplo inicial da área exclusiva da sua instituição. As informações reais aparecerão quando o cadastro e as solicitações estiverem conectados à API.</p>

        <div className="dashboard-ong-cards">
          <article><span>🥕</span><h3>Doações disponíveis</h3><p>Encontre alimentos que podem ajudar sua instituição.</p><Link to="/Doacoes">Ver doações</Link></article>
          <article><span>📋</span><h3>Minhas solicitações</h3><p>Acompanhe as solicitações enviadas aos estabelecimentos.</p><p className="dashboard-ong-em-breve">Área demonstrativa</p></article>
          <article><span>🥦</span><h3>Necessidades da ONG</h3><p>Consulte os alimentos que sua instituição informou precisar.</p><p className="dashboard-ong-em-breve">Área demonstrativa</p></article>
        </div>
        <p className="dashboard-ong-aviso">Tela ilustrativa: os cartões ainda não exibem dados reais do banco.</p>
      </section>
    </main>
  );
}
