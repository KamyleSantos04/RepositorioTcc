import './index.scss'
import { Link, useNavigate } from 'react-router-dom'

export default function Entrar() {
    const navegar = useNavigate()

    async function entrar(event) {
        event.preventDefault()

        const email = document.querySelector('.entrar input[type="text"]').value
        const senha = document.querySelector('.entrar input[type="password"]').value
        const tipoConta = document.querySelector('.entrar select').value

        if (!email || !senha) {
            alert('Preencha o e-mail e a senha!')
            return
        }

        if (!tipoConta) {
            alert('Escolha o tipo de conta!')
            return
        }

        try {
            const resposta = await fetch(
                'http://localhost:3001/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha })
                }
            )

            const resultado = await resposta.json()

            if (!resposta.ok) {
                alert(resultado.erro || 'E-mail ou senha incorretos.')
                return
            }

            // O backend retorna o tipo diretamente em resultado.tipo
            const tipo = resultado.tipo

            if (!tipo) {
                alert('O servidor não retornou o tipo de conta.')
                return
            }

            if (tipo !== tipoConta) {
                alert('O tipo de conta selecionado não corresponde ao seu cadastro.')
                return
            }

            // Salva os dados usados pelo Dashboard
            sessionStorage.setItem('tokenConectaAlimento', resultado.token)
            sessionStorage.setItem('tipoContaConectaAlimento', tipo)
            sessionStorage.setItem('perfilId', resultado.perfilId)
            sessionStorage.setItem(
                'nomeContaConectaAlimento',
                resultado.nome || ''
            )

            // Abre o dashboard correspondente
            if (tipo === 'ESTABELECIMENTO') {
                navegar('/DashEstabelecimento')
            } else if (tipo === 'ONG') {
                navegar('/DashONG')
            } else {
                alert('Tipo de conta não reconhecido.')
            }

        } catch (erro) {
            console.error('Erro no login:', erro)

            alert(
                'Não foi possível conectar ao servidor. Confira se o backend está ligado na porta 3001.'
            )
        }
    }

    return (
        <div className='entrar'>
            <img
                src='/assets/images/logo.png'
                alt='Logo Conecta-Alimento'
                width={150}
            />

            <h1>Bem-Vindo de volta!</h1>
            <p>Faça login para continuar</p>

            <form onSubmit={entrar}>
                <h2>Email ou Usuário</h2>
                <input
                    type='text'
                    placeholder='Digite seu e-mail'
                    required
                />

                <h2>Senha</h2>
                <input
                    type='password'
                    placeholder='Digite sua senha'
                    required
                />

                <h2>Tipo de conta</h2>
                <select defaultValue='' required>
                    <option value='' disabled>
                        Selecione sua conta
                    </option>
                    <option value='ONG'>ONG ou Instituição</option>
                    <option value='ESTABELECIMENTO'>
                        Estabelecimento Doador
                    </option>
                </select>

                <p>Esqueceu a senha?</p>

                <button type='submit'>Entrar</button>
            </form>

            <p>Ou</p>

            <Link to='/Criar'>
                <button type='button'>Criar conta</button>
            </Link>
        </div>
    )
}