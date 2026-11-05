import './index.scss'
import { Link, useNavigate } from 'react-router-dom'

export default function Entrar(){
    const navegar = useNavigate()

    async function entrar(){
        const email = document.querySelector('.entrar input[type="text"]').value
        const senha = document.querySelector('.entrar input[type="password"]').value

        try {
            const resposta = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            })

            const resultado = await resposta.json()

            if (!resposta.ok) {
                alert(resultado.erro || 'Erro ao fazer login')
                return
            }

            sessionStorage.setItem('token', resultado.token)
            sessionStorage.setItem('tipoConta', resultado.usuario.tipo)

            if (resultado.usuario.tipo === 'ESTABELECIMENTO') {
                navegar('/DashEstabelecimento')
            } else if (resultado.usuario.tipo === 'ONG') {
                navegar('/dashong')
            } else {
                alert('Tipo de conta não reconhecido.')
            }

        } catch (erro) {
            alert('Não foi possível conectar com o servidor.')
        }
    }

    return(
        <div className='entrar'>
            <img src='./assets/images/logo.png' alt='' width={150}/>

            <h1>Bem-Vindo de volta!</h1>
            <p>faça login para continuar</p>

            <h2>Email ou Usuário</h2>
            <input type='text' placeholder='Digite seu e-mail'/>

            <h2>Senha</h2>
            <input type='password' placeholder='Digite sua senha'/>

            <p>esqueceu a senha?</p>

            <button onClick={entrar}>entrar</button>
            <p>ou</p>
            <Link to='/Criar'><button>criar conta</button></Link>
        </div>
    )
}
