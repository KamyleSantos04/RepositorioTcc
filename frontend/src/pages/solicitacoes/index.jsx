import './index.scss';

export default function Solicitacoes() {
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
        <h1>Solicitações</h1>
        <p>Veja as instituições interessadas nas suas doações.</p>

        <div className="lista">
          <div className="card">
            <h2>ONG Esperança</h2>
            <p>Alimento solicitado: Pães franceses</p>
            <p>Quantidade: 20 unidades</p>
            <span className="status solicitada">Aguardando confirmação</span>

            <div className="botoes">
              <button className="botao">Confirmar</button>
              <button className="botao secundario">Recusar</button>
            </div>
          </div>

          <div className="card">
            <h2>Instituição Vida Nova</h2>
            <p>Alimento solicitado: Frutas variadas</p>
            <p>Quantidade: 10 kg</p>
            <span className="status ativa">Solicitação recebida</span>

            <div className="botoes">
              <button className="botao">Confirmar</button>
              <button className="botao secundario">Recusar</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}