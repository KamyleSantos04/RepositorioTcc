
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

export default function CadastroInstituicao() {
  const [mensagem, setMensagem] = useState('');
  const [outroTipo, setOutroTipo] = useState(false);
  const navegar = useNavigate();

  async function cadastrar(event) {
    event.preventDefault();

    const formulario = event.currentTarget;
    const formularioDados = new FormData(formulario);
    const dados = Object.fromEntries(formularioDados);

    if (dados.senha !== dados.confirmarSenha) {
      setMensagem('As senhas não são iguais!');
      return;
    }

    delete dados.confirmarSenha;

    try {
      const resposta = await fetch(
        'http://localhost:3001/api/auth/cadastro/ong',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados)
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro || 'Erro ao cadastrar instituição.'
        );
      }

      // Faz login automaticamente após o cadastro
      const respostaLogin = await fetch(
        'http://localhost:3001/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: dados.email,
            senha: dados.senha
          })
        }
      );

      const login = await respostaLogin.json();

      if (!respostaLogin.ok || !login.token || login.tipo !== 'ONG') {
        setMensagem(
          'Cadastro realizado! Entre com seu e-mail e senha para acessar sua conta.'
        );
        return;
      }

      // Salva os dados que o dashboard utiliza
      sessionStorage.setItem(
        'tokenConectaAlimento',
        login.token
      );

      sessionStorage.setItem(
        'tipoContaConectaAlimento',
        login.tipo
      );

      sessionStorage.setItem(
        'perfilId',
        login.perfilId
      );

      sessionStorage.setItem(
        'nomeContaConectaAlimento',
        login.nome || dados.nome
      );

      formulario.reset();
      setOutroTipo(false);

      // Abre o dashboard da ONG
      navegar('/DashONG');

    } catch (erro) {
      console.error('Erro no cadastro:', erro);
      setMensagem(
        erro.message || 'Erro ao realizar cadastro.'
      );
    }
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
            name="nome"
            placeholder="Digite o nome da instituição"
            required
          />

          <label>Tipo de instituição</label>
          <select
            name="tipoInstituicao"
            required
            defaultValue=""
            onChange={(e) => {
              setOutroTipo(e.target.value === 'outro');
            }}
          >
            <option value="" disabled>Selecione o tipo</option>
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
                name="outroTipo"
                placeholder="Digite o tipo de instituição"
                required
              />
            </>
          )}

          <label>CNPJ</label>
          <input
            type="text"
            name="cnpj"
            placeholder="00.000.000/0000-00"
            required
          />

          <label>Descrição da instituição</label>
          <textarea
            name="descricao"
            placeholder="Conte um pouco sobre a instituição"
            required
          />

          <h2>Responsável</h2>

          <label>Nome completo</label>
          <input
            type="text"
            name="responsavel"
            placeholder="Nome do responsável"
            required
          />

          <label>Telefone</label>
          <input
            type="tel"
            name="telefone"
            placeholder="(00) 00000-0000"
            required
          />

          <label>E-mail</label>
          <input
            type="email"
            name="email"
            placeholder="instituicao@email.com"
            required
          />

          <h2>Endereço</h2>

          <label>CEP</label>
          <input
            type="text"
            name="cep"
            placeholder="00000-000"
            required
          />

          <label>Estado</label>
          <input
            type="text"
            name="estado"
            placeholder="Ex.: SP"
            required
          />

          <label>Rua</label>
          <input
            type="text"
            name="rua"
            placeholder="Nome da rua"
            required
          />

          <label>Número</label>
          <input
            type="text"
            name="numero"
            placeholder="Número"
            required
          />

          <label>Complemento</label>
          <input
            type="text"
            name="complemento"
            placeholder="Apartamento, bloco etc. (opcional)"
          />

          <label>Bairro</label>
          <input
            type="text"
            name="bairro"
            placeholder="Nome do bairro"
            required
          />

          <label>Cidade</label>
          <input
            type="text"
            name="cidade"
            placeholder="Nome da cidade"
            required
          />

          <h2>Informações sobre a instituição</h2>

          <label>Quantas pessoas são atendidas?</label>
          <input
            type="number"
            name="pessoasAtendidas"
            min="1"
            placeholder="Quantidade de pessoas"
            required
          />

          <label>Frequência de recebimento das doações</label>
          <select
            name="frequenciaDoacao"
            required
            defaultValue=""
          >
            <option value="" disabled>Selecione a frequência</option>
            <option value="semanal">Semanal</option>
            <option value="quinzenal">Quinzenal</option>
            <option value="mensal">Mensal</option>
            <option value="conforme-necessidade">
              Conforme a necessidade
            </option>
          </select>

          <label>Quais alimentos a instituição mais precisa?</label>
          <textarea
            name="alimentosNecessarios"
            placeholder="Ex.: arroz, feijão, leite, frutas..."
            required
          />

          <label>Observações adicionais</label>
          <textarea
            name="observacoes"
            placeholder="Alguma informação importante? (opcional)"
          />

          <h2>Segurança da conta</h2>

          <label>Senha</label>
          <input
            type="password"
            name="senha"
            placeholder="Crie uma senha"
            minLength="6"
            required
          />

          <label>Confirmar senha</label>
          <input
            type="password"
            name="confirmarSenha"
            placeholder="Digite a senha novamente"
            minLength="6"
            required
          />

          <button type="submit">
            Cadastrar instituição
          </button>

          {mensagem && (
            <p className="mensagem-sucesso" role="status">
              {mensagem}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
