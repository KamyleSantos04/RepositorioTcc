import './index.scss';

export default function Historico() {
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
        <h1>Histórico de doações</h1>
        <p>Acompanhe as doações concluídas pelo seu estabelecimento.</p>

        <div className="resumos">
          <div className="card">
            <h2>27</h2>
            <p>Doações concluídas</p>
          </div>

          <div className="card">
            <h2>438 kg</h2>
            <p>Alimentos destinados</p>
          </div>
        </div>

        <div className="card">
          <h2>Pães franceses</h2>
          <p>Quantidade: 30 unidades</p>
          <p>Destino: ONG Esperança</p>
          <p>Data: 05/11/2026</p>
          <span className="status concluida">Concluída</span>
        </div>

        <div className="card">
          <h2>Frutas variadas</h2>
          <p>Quantidade: 15 kg</p>
          <p>Destino: Instituição Vida Nova</p>
          <p>Data: 03/11/2026</p>
          <span className="status concluida">Concluída</span>
        </div>
      </main>
    </div>
  );
}