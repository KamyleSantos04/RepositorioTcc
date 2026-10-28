
import { useState } from 'react';
import './index.scss';

export default function Estabelecimento() {
  const [mensagem, setMensagem] = useState('');
  const [outroTipo, setOutroTipo] = useState(false);

  function cadastrar(event) {
    event.preventDefault();
    setMensagem('Cadastro realizado com sucesso!');
  }

  return (
    <div className="cadastro-estabelecimento">
      <div className="conteudo-estabelecimento">
        <h1>Cadastro de Estabelecimento</h1>

        <p>
          Cadastre seu estabelecimento e faça parte do
          Alimento que Conecta, ajudando a transformar
          alimentos em oportunidades.
        </p>

        <form onSubmit={cadastrar}>
          <h2>Dados do estabelecimento</h2>

          <label>Nome do estabelecimento</label>
          <input
            type="text"
            placeholder="Digite o nome do estabelecimento"
            required
          />

          <label>Tipo de estabelecimento</label>
          <select
            required
            defaultValue=""
            onChange={(e) => {
              setOutroTipo(e.target.value === 'outro');
            }}
          >
            <option value="" disabled>
              Selecione o tipo
            </option>
            <option value="supermercado">Supermercado</option>
            <option value="restaurante">Restaurante</option>
            <option value="padaria">Padaria</option>
            <option value="hortifruti">Hortifruti</option>
            <option value="mercado">Mercado</option>
            <option value="outro">Outro</option>
          </select>

          {outroTipo && (
            <>
              <label>Qual é o tipo de estabelecimento?</label>
              <input
                type="text"
                placeholder="Digite o tipo de estabelecimento"
                required
              />
            </>
          )}

          <label>CNPJ</label>
          <input
            type="text"
            placeholder="00.000.000/0000-00"
            required
          />

          <h2>Contato</h2>

          <label>Telefone</label>
          <input
            type="tel"
            placeholder="(00) 00000-0000"
            required
          />

          <label>E-mail</label>
          <input
            type="email"
            placeholder="estabelecimento@email.com"
            required
          />

          <h2>Endereço</h2>

          <label>CEP</label>
          <input
            type="text"
            placeholder="00000-000"
            required
          />

          <label>Rua</label>
          <input
            type="text"
            placeholder="Nome da rua"
            required
          />

          <label>Número</label>
          <input
            type="text"
            placeholder="Número do estabelecimento"
            required
          />

          <label>Complemento</label>
          <input
            type="text"
            placeholder="Complemento (opcional)"
          />

          <label>Bairro</label>
          <input
            type="text"
            placeholder="Nome do bairro"
            required
          />

          <label>Cidade</label>
          <input
            type="text"
            placeholder="Nome da cidade"
            required
          />

          <label>Estado</label>
          <input
            type="text"
            placeholder="Ex.: SP"
            required
          />

          <h2>Dados do responsável</h2>

          <label>Nome completo do responsável</label>
          <input
            type="text"
            placeholder="Nome completo"
            required
          />

          <label>CPF do responsável</label>
          <input
            type="text"
            placeholder="000.000.000-00"
            required
          />

          <label>Cargo</label>
          <input
            type="text"
            placeholder="Ex.: gerente, proprietário"
            required
          />

          <h2>Segurança da conta</h2>

          <label>Senha</label>
          <input
            type="password"
            placeholder="Crie uma senha"
            minLength="6"
            required
          />

          <label>Confirmar senha</label>
          <input
            type="password"
            placeholder="Digite a senha novamente"
            minLength="6"
            required
          />

          <label className="termo-estabelecimento">
            <input type="checkbox" required />
            Concordo com os termos de cadastro e participação
            no Alimento que Conecta.
          </label>

          <button type="submit">
            Criar conta
          </button>

          {mensagem && (
            <p
              className="mensagem-sucesso"
              role="status"
            >
              {mensagem}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}