
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

export default function Entrar() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    const navigate = useNavigate();

    async function entrar(event) {
        event.preventDefault();
        setMensagem('');

        try {
            const resposta = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                setMensagem(dados.erro || 'Não foi possível realizar o login.');
                return;
            }

            sessionStorage.setItem('tokenConectaAlimento', dados.token);
            sessionStorage.setItem('tipoContaConectaAlimento', dados.tipo);
            sessionStorage.setItem('nomeContaConectaAlimento', dados.nome);

            if (dados.tipo === 'ESTABELECIMENTO') {
                navigate('/DashEstabelecimento');
            } else if (dados.tipo === 'ONG') {
                navigate('/DashONG');
            } else {
                setMensagem('Tipo de conta inválido.');
            }

        } catch (erro) {
            setMensagem('Não foi possível conectar ao servidor.');
        }
    }

    return (
        <div className="pagina-login">

            <div className="login-container">

                <a href="/" className="login-voltar">← Voltar</a>

                <div className="login-conteudo">

                    <h1>Bem-vindo de volta!</h1>

                    <p>Entre na sua conta para continuar conectando pessoas e alimentos.</p>

                    <form onSubmit={entrar}>

                        <label>E-mail</label>
                        <input
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label>Senha</label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />

                        {mensagem && (
                            <p className="login-mensagem">{mensagem}</p>
                        )}

                        <button type="submit">Entrar na conta</button>

                    </form>

                    <p className="login-cadastro">
                        Ainda não tem uma conta?
                        <a href="/CriarConta"> Cadastre-se</a>
                    </p>

                </div>
            </div>

        </div>
    );
}
