import './index.scss';

export default function MinhasDoacoes() {
  return (
    <div className="pagina">
      <aside className="menu">
        <img src="/assets/images/logo.png" alt="Logo" className="logo" />

        <a href="/dashboard">Início</a>
        <a href="/minhas-doacoes">Minhas doações</a>
        <a href="/solicitacoes">Solicitações</a>
        <a href="/historico">Histórico</a>
        <a href="/meus-estabelecimentos">Meus estabelecimentos</a>
        <a href="/configuracao">Configuração</a>
        <a href="/login" className="sair">Sair</a>
      </aside>

      <main className="conteudo">
        <h1>Minhas doações</h1>
        <p>Acompanhe os alimentos que você disponibilizou.</p>

        <div className="acoes">
          <a href="/cadastrar-alimento" className="botao">
            + Cadastrar alimento
          </a>
        </div>

        <div className="lista">
          <div className="card">
            <h2>Pães franceses</h2>
            <p>Quantidade: 30 unidades</p>
            <p>Retirada até: 16:30</p>
            <span className="status ativa">Ativa</span>
          </div>

          <div className="card">
            <h2>Frutas variadas</h2>
            <p>Quantidade: 15 kg</p>
            <p>Retirada até: 16:00</p>
            <span className="status solicitada">Solicitada</span>
          </div>

          <div className="card">
            <h2>Refeições prontas</h2>
            <p>Quantidade: 50 unidades</p>
            <p>Retirada até: 12:00</p>
            <span className="status concluida">Concluída</span>
          </div>
        </div>
      </main>
    </div>
  );
}