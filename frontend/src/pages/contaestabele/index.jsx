
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { salvarSessao } from '../../lib/sessao';
import './index.scss';

export default function Estabelecimento() {
  const [mensagem, setMensagem] = useState({ texto: '', tipo: 'erro' });
  const [outroTipo, setOutroTipo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const navegar = useNavigate();

  async function cadastrar(event) {
    event.preventDefault();

    const formulario = event.currentTarget;
    const formularioDados = new FormData(formulario);
    const dados = Object.fromEntries(formularioDados);

    if (dados.senha !== dados.confirmarSenha) {
      setMensagem({ texto: 'As senhas não são iguais!', tipo: 'erro' });
      return;
    }

    delete dados.confirmarSenha;
    setMensagem({ texto: '', tipo: 'erro' });
    setEnviando(true);

    try {
      await api.cadastrarEstabelecimento(dados);

      // Faz login automaticamente após o cadastro
      const login = await api.login(dados.email, dados.senha);

      if (
        !login.token ||
        login.tipo !== 'ESTABELECIMENTO'
      ) {
        setMensagem({
          texto:
            'Cadastro realizado! Entre com seu e-mail e senha para acessar sua conta.',
          tipo: 'sucesso'
        });
        return;
      }

      // Salva a sessão que o dashboard utiliza
      salvarSessao({ ...login, nome: login.nome || dados.nome });

      formulario.reset();
      setOutroTipo(false);

      // Abre o dashboard do estabelecimento
      navegar('/DashEstabelecimento');

    } catch (erro) {
      console.error('Erro no cadastro:', erro);
      setMensagem({
        texto: erro.message || 'Erro ao realizar cadastro.',
        tipo: 'erro'
      });
    } finally {
      setEnviando(false);
    }
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
            name="nome"
            placeholder="Digite o nome do estabelecimento"
            required
          />

          <label>Tipo de estabelecimento</label>
          <select
            name="tipoEstabelecimento"
            required
            defaultValue=""
            onChange={(e) => {
              setOutroTipo(e.target.value === 'outro');
            }}
          >
            <option value="" disabled>Selecione o tipo</option>
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
                name="outroTipo"
                placeholder="Digite o tipo de estabelecimento"
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

          <h2>Contato</h2>

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
            placeholder="estabelecimento@email.com"
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
            placeholder="Número do estabelecimento"
            required
          />

          <label>Complemento</label>
          <input
            type="text"
            name="complemento"
            placeholder="Complemento (opcional)"
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

          <label>Estado</label>
          <input
            type="text"
            name="estado"
            placeholder="Ex.: SP"
            required
          />

          <h2>Dados do responsável</h2>

          <label>Nome completo do responsável</label>
          <input
            type="text"
            name="responsavel"
            placeholder="Nome completo"
            required
          />

          <label>CPF do responsável</label>
          <input
            type="text"
            name="cpfResponsavel"
            placeholder="000.000.000-00"
            required
          />

          <label>Cargo</label>
          <input
            type="text"
            name="cargoResponsavel"
            placeholder="Ex.: gerente, proprietário"
            required
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

          <label className="termo-estabelecimento">
            <input type="checkbox" required />
            Concordo com os termos de cadastro e participação
            no Alimento que Conecta.
          </label>

          <button type="submit" disabled={enviando}>
            {enviando ? 'Criando conta...' : 'Criar conta'}
          </button>

          {mensagem.texto && (
            <p
              className={`mensagem-sucesso mensagem-${mensagem.tipo}`}
              role="status"
            >
              {mensagem.texto}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
