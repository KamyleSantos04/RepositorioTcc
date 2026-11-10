import './index.scss'
import { useState } from 'react'
import {
    Link,
    useNavigate,
    useSearchParams
} from 'react-router-dom'
import { api } from '../../lib/api'
import {
    rotaInicial,
    rotaPorOrigem,
    salvarSessao,
    tipoPorOrigem,
    TIPO_ESTABELECIMENTO,
    TIPO_ONG
} from '../../lib/sessao'

export default function Entrar() {

    const navegar = useNavigate()

    const [parametros] = useSearchParams()

    const origem = parametros.get('origem')
    const destinoPedido = parametros.get('destino')
    const tipoSugerido = tipoPorOrigem(origem)

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [tipoConta, setTipoConta] = useState(tipoSugerido || '')
    const [entrando, setEntrando] = useState(false)

    /** Destino seguro: só aceita caminhos internos do próprio sistema. */
    function destinoValido(tipo) {
        if (destinoPedido && destinoPedido.startsWith('/')) {
            const ehRotaDeOng = destinoPedido.startsWith('/DashONG')
            const ehRotaDeEstabelecimento =
                destinoPedido.startsWith('/DashEstabelecimento') ||
                destinoPedido.startsWith('/MinhasDoacoes') ||
                destinoPedido.startsWith('/Solicitacoes') ||
                destinoPedido.startsWith('/Historico') ||
                destinoPedido.startsWith('/MeusEstabelecimentos') ||
                destinoPedido.startsWith('/PerfilEstabelecimento') ||
                destinoPedido.startsWith('/Configuracao')

            if (tipo === TIPO_ONG && ehRotaDeOng) return destinoPedido
            if (tipo === TIPO_ESTABELECIMENTO && ehRotaDeEstabelecimento) {
                return destinoPedido
            }
        }

        // A rota de cadastro de alimento é compartilhada e só faz sentido
        // para estabelecimentos.
        if (destinoPedido === '/CadastrarAlimento') {
            return tipo === TIPO_ESTABELECIMENTO ? destinoPedido : null
        }

        return null
    }

    async function entrar(event) {

        event.preventDefault()

        if (!email || !senha) {
            alert('Preencha o e-mail e a senha!')
            return
        }

        if (!tipoConta) {
            alert('Escolha o tipo de conta!')
            return
        }

        setEntrando(true)

        try {

            const resultado = await api.login(email.trim(), senha)

            const tipo = resultado.tipo

            if (!tipo) {
                alert('O servidor não retornou o tipo de conta.')
                return
            }

            if (tipo !== tipoConta) {
                alert('O tipo de conta selecionado não corresponde ao seu cadastro.')
                return
            }

            // Valida o destino do botão usado na página inicial
            // antes de gravar a sessão.
            if (origem === 'doar' && tipo !== TIPO_ESTABELECIMENTO) {
                alert('Para doar alimentos, entre com uma conta de estabelecimento doador.')
                return
            }

            if (origem === 'receber' && tipo !== TIPO_ONG) {
                alert('Para solicitar alimentos, entre com uma conta de ONG ou instituição.')
                return
            }

            salvarSessao(resultado)

            const destino =
                destinoValido(tipo) ||
                (origem ? rotaPorOrigem(origem) : null)

            navegar(destino || rotaInicial(tipo), { replace: true })

        } catch (erro) {

            console.error('Erro no login:', erro)

            alert(erro.message || 'Não foi possível realizar o login.')

        } finally {

            setEntrando(false)

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
                            value={email}
                            onChange={(evento) => setEmail(evento.target.value)}
                            required
                        />

                    </div>

                    <div className="senha">

                        <h2>Senha</h2>

                        <input
                            type='password'
                            placeholder='Digite sua senha'
                            value={senha}
                            onChange={(evento) => setSenha(evento.target.value)}
                            required
                        />

                    </div>

                    <div className="conta">

                        <h2>Tipo de conta</h2>

                        <select
                            value={tipoConta}
                            onChange={(evento) => setTipoConta(evento.target.value)}
                            required
                        >

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

                    <button className='botaoum' type='submit' disabled={entrando}>
                        {entrando ? 'Entrando...' : 'Entrar'}
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
