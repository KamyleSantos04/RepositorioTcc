
import './index.scss'
import {
    Link,
    useNavigate,
    useSearchParams
} from 'react-router-dom'

export default function Entrar() {

    const navegar = useNavigate()

    const [parametros] = useSearchParams()

    const origem = parametros.get('origem')

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

            const tipo = resultado.tipo

            if (!tipo) {
                alert('O servidor não retornou o tipo de conta.')
                return
            }

            if (tipo !== tipoConta) {
                alert('O tipo de conta selecionado não corresponde ao seu cadastro.')
                return
            }

            // Define o destino conforme o botão utilizado na página inicial.

            let destino = null

            if (origem === 'doar') {

                if (tipo !== 'ESTABELECIMENTO') {
                    alert('Para doar alimentos, entre com uma conta de estabelecimento doador.')
                    return
                }

                destino = '/CadastrarAlimento'

            } else if (origem === 'receber') {

                if (tipo !== 'ONG') {
                    alert('Para solicitar alimentos, entre com uma conta de ONG ou instituição.')
                    return
                }

                destino = '/Doacoes'

            }

            // Salva os dados somente depois de validar o tipo de conta.

            sessionStorage.setItem(
                'tokenConectaAlimento',
                resultado.token
            )

            sessionStorage.setItem(
                'tipoContaConectaAlimento',
                tipo
            )

            sessionStorage.setItem(
                'perfilId',
                resultado.perfilId
            )

            sessionStorage.setItem(
                'nomeContaConectaAlimento',
                resultado.nome || ''
            )

            // Redireciona conforme a escolha inicial.

            if (destino) {
                navegar(destino)
                return
            }

            // Mantém o comportamento original para quem
            // acessa o login pelo menu superior.

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

            <div className='hola'>

                <img
                    className='logu'
                    src='/assets/images/logo.png'
                    alt='Logo Conecta-Alimento'
                    width={150}
                />

                <div className="bemvindo">

                    <h1>Bem-vindo de volta!</h1>

                    <p>Faça login para continuar</p>

                </div>

            </div>

            <div className="mano">

                <form onSubmit={entrar}>

                    <div className="email">

                        <h2>Email ou Usuário</h2>

                        <input
                            type='text'
                            placeholder='Digite seu e-mail'
                            required
                        />

                    </div>

                    <div className="senha">

                        <h2>Senha</h2>

                        <input
                            type='password'
                            placeholder='Digite sua senha'
                            required
                        />

                    </div>

                    <div className="conta">

                        <h2>Tipo de conta</h2>

                        <select defaultValue='' required>

                            <option value='' disabled>
                                Selecione sua conta
                            </option>

                            <option value='ONG'>
                                ONG ou Instituição
                            </option>

                            <option value='ESTABELECIMENTO'>
                                Estabelecimento Doador
                            </option>

                        </select>

                    </div>

                    <p className='esque'>
                        Esqueceu a senha?
                    </p>

                    <button className='botaoum' type='submit'>
                        Entrar
                    </button>

                </form>

                <p className='ou'>ou</p>

                <Link to='/Criar'>

                    <button className='botaodois' type='button'>
                        Criar conta
                    </button>

                </Link>

            </div>

        </div>

    )
}
