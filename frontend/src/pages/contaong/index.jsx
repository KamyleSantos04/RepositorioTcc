
import React, { useState } from 'react';
import './index.scss';

export default function CadastroInstituicao() {
  const [mensagem, setMensagem] = useState('');
  const [outroTipo, setOutroTipo] = useState(false);

  function cadastrar(event) {
    event.preventDefault();
    setMensagem('Cadastro realizado com sucesso!');
  }

  return (
    <div className="cadastro-instituicao">
      <div className="conteudo-instituicao">
        <h1>Cadastro de ONG ou Instituição</h1>

        <p>
          Cadastre sua instituição para conectar-se a doações de alimentos.
        </p>

        <form onSubmit={cadastrar}>
          <h2>Dados da instituição</h2>

          <label>Nome da instituição</label>
          <input
            type="text"
            placeholder="Digite o nome da instituição"
            required
          />

          <label>Tipo de instituição</label>
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
            <option value="ong">ONG</option>
            <option value="abrigo">Abrigo</option>
            <option value="instituicao-social">
              Instituição social
            </option>
            <option value="outro">Outro</option>
          </select>

          {outroTipo && (
            <>
              <label>Qual é o tipo de instituição?</label>
              <input
                type="text"
                placeholder="Digite o tipo de instituição"
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

          <label>Descrição da instituição</label>
          <textarea
            placeholder="Conte um pouco sobre a instituição"
            required
          />

          <h2>Responsável</h2>

          <label>Nome completo</label>
          <input
            type="text"
            placeholder="Nome do responsável"
            required
          />

          <label>Telefone</label>
          <input
            type="tel"
            placeholder="(00) 00000-0000"
            required
          />

          <label>E-mail</label>
          <input
            type="email"
            placeholder="instituicao@email.com"
            required
          />

          <h2>Endereço</h2>

          <label>CEP</label>
          <input
            type="text"
            placeholder="00000-000"
            required
          />

          <label>Estado</label>
          <input
            type="text"
            placeholder="Ex.: SP"
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
            placeholder="Número"
            required
          />

          <label>Complemento</label>
          <input
            type="text"
            placeholder="Apartamento, bloco etc. (opcional)"
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

          <h2>Informações sobre a instituição</h2>

          <label>Quantas pessoas são atendidas?</label>
          <input
            type="number"
            min="1"
            placeholder="Quantidade de pessoas"
            required
          />

          <label>Frequência de recebimento das doações</label>
          <select required defaultValue="">
            <option value="" disabled>
              Selecione a frequência
            </option>
            <option value="semanal">Semanal</option>
            <option value="quinzenal">Quinzenal</option>
            <option value="mensal">Mensal</option>
            <option value="conforme-necessidade">
              Conforme a necessidade
            </option>
          </select>

          <label>Quais alimentos a instituição mais precisa?</label>
          <textarea
            placeholder="Ex.: arroz, feijão, leite, frutas..."
            required
          />

          <label>Observações adicionais</label>
          <textarea
            placeholder="Alguma informação importante? (opcional)"
          />

          <button type="submit">
            Cadastrar instituição
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