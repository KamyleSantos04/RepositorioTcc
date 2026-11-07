import './index.scss';

const nomeEstabelecimento =
  sessionStorage.getItem('nomeContaConectaAlimento') ||
  'Meu estabelecimento';

export default function MeusEstabelecimentos() {
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
        <h1>Meus estabelecimentos</h1>
        <p>Confira as informações do seu estabelecimento.</p>

        <div className="card estabelecimento-card">
          <div className="icone-estabelecimento">🏪</div>

          <h2>{nomeEstabelecimento}</h2>
          <p>Tipo: Estabelecimento doador</p>
          <p>Situação: Cadastrado</p>

          <button className="botao">Editar informações</button>
        </div>
      </main>
    </div>
  );
}