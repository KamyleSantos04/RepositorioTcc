import './index.scss';

const nomeEstabelecimento =
  sessionStorage.getItem('nomeContaConectaAlimento') ||
  'Meu estabelecimento';

export default function Configuracao() {
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
        <h1>Configuração</h1>
        <p>Consulte e edite as informações da sua conta.</p>

        <div className="card">
          <h2>Dados da conta</h2>

          <form>
            <label htmlFor="nome">Nome do estabelecimento</label>
            <input
              id="nome"
              type="text"
              defaultValue={nomeEstabelecimento}
            />

            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
            />

            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              type="tel"
              placeholder="Digite seu telefone"
            />

            <button type="button" className="botao">
              Salvar alterações
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}