
import './index.scss';
import { Link } from 'react-router-dom';

export default function CadastrarAlimento() {
  return (
    <div className="pagina-cadastro">

      {/* MENU LATERAL */}
      <aside className="menu-lateral">

        <div className="logo">
          <img
            src=""
            alt=""
            width="150"
            height="65"
          />
        </div>

        <nav>
          <Link to="/">
            <img src="" alt="" />
            Início
          </Link>

          <Link to="/minhasdoacoes">
            <img src="" alt="" />
            minhas doações
          </Link>

          <Link to="/solicitacoes">
            <img src="" alt="" />
            Solicitações
          </Link>

          <Link to="/historico">
            <img src="" alt="" />
            Histórico
          </Link>

          <Link to="/estabelecimento">
            <img src="" alt="" />
            Meu Estabelecimento
          </Link>

          <Link to="/configuracoes">
            <img src="" alt="" />
            configurações
          </Link>
        </nav>

        <Link to="/sair" className="sair">
          <img src="" alt="" />
          Sair
        </Link>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="conteudo">

        <div className="formulario-area">

          <Link to="/minhasdoacoes" className="voltar">
            ← Voltar
          </Link>

          <h2>Cadastrar Alimento</h2>

          <form className="form-cadastro">

            <div className="campo campo-tipo">
              <label>Tipo de alimento *</label>

              <select required defaultValue="">
                <option value="" disabled>Selecione</option>
                <option>Frutas</option>
                <option>Verduras e legumes</option>
                <option>Grãos e cereais</option>
                <option>Laticínios</option>
                <option>Carnes</option>
                <option>Alimentos preparados</option>
                <option>Outros</option>
              </select>
            </div>

            <div className="campo campo-descricao">
              <label>Descrição *</label>

              <textarea
                placeholder="Ex.: 30 pães franceses"
                required
              />
            </div>

            <div className="linha">

              <div className="campo">
                <label>Quantidade *</label>

                <input
                  type="number"
                  min="1"
                  placeholder="Ex.: 30"
                  required
                />
              </div>

              <div className="campo">
                <label>Unidade *</label>

                <select required defaultValue="">
                  <option value="" disabled>Selecione</option>
                  <option>Unidades</option>
                  <option>Kg</option>
                  <option>Gramas</option>
                  <option>Litros</option>
                  <option>Pacotes</option>
                  <option>Caixas</option>
                </select>
              </div>

            </div>

            <div className="linha">

              <div className="campo">
                <label>Data de produção *</label>
                <input type="date" required />
              </div>

              <div className="campo">
                <label>Prazo/validade *</label>
                <input type="date" required />
              </div>

            </div>

            <div className="campo campo-aberto">

              <label>O alimento está aberto?</label>

              <div className="opcoes">

                <label>
                  <input type="radio" name="aberto" value="sim" />
                  Sim
                </label>

                <label>
                  <input type="radio" name="aberto" value="nao" />
                  Não
                </label>

              </div>
            </div>

            <div className="linha linha-inferior">

              <div className="campo">
                <label>Forma de armazenamento *</label>

                <select required defaultValue="">
                  <option value="" disabled>Selecione</option>
                  <option>Temperatura ambiente</option>
                  <option>Refrigerado</option>
                  <option>Congelado</option>
                </select>
              </div>

              <div className="campo">
                <label>Horário limite para retirada *</label>
                <input type="time" required />
              </div>

            </div>

            <div className="campo campo-local">
              <label>Local de retirada *</label>

              <input
                type="text"
                placeholder="Endereço completo"
                required
              />
            </div>

            <div className="botoes">

              <button type="reset" className="cancelar">
                Cancelar
              </button>

              <button type="submit" className="publicar">
                Publicar doação
              </button>

            </div>

          </form>
        </div>

        {/* QUADRO DE DICA */}
        <aside className="dica">

          <div className="dica-texto">

            <h3>
              <img src="" alt="" />
              Dica
            </h3>

            <p>
              Quanto mais informações você preencher,
              maior a chance de obter a melhor oportunidade.
            </p>

          </div>

          <div className="foto-dica">
            FOTO_CAIXA_DE_ALIMENTOS
          </div>

        </aside>

      </main>
    </div>
  );
}
