
import './index.scss'
import { Link } from 'react-router-dom'

export default function ComoFunciona() {
    return (
        <section className="como-funciona">

            <div className="cabecalho-como-funciona">
                <Link to="/" className="logo-conecta">
                    <img
                        src="/assets/images/logo.png"
                        alt="Logo Conecta-Alimento"
                    />
                </Link>

                <Link to="/" className="voltar-como-funciona">
                    Voltar
                </Link>
            </div>

            <div className="titulo-secao">
                <h1>Como funciona o Conecta-Alimento?</h1>

                <p className="descricao">
                    Conectamos quem tem alimentos para doar
                    a quem precisa deles.
                </p>
            </div>

            <div className="etapas">

                <div className="card-etapa">
                    <span className="numero">01</span>

                    <div className="icone-etapa">
                        <img
                            src="/assets/icons/cadastro.png"
                            alt="Cadastro na plataforma"
                        />
                    </div>

                    <h2>Cadastre-se</h2>

                    <p>
                        Estabelecimentos e instituições criam
                        suas contas na plataforma para começar.
                    </p>
                </div>

                <div className="card-etapa">
                    <span className="numero">02</span>

                    <div className="icone-etapa">
                        <img
                            src="/assets/icons/doasao.png"
                            alt="Doação de alimentos"
                        />
                    </div>

                    <h2>Conecte-se</h2>

                    <p>
                        Os doadores disponibilizam alimentos
                        e as instituições informam suas necessidades.
                    </p>
                </div>

                <div className="card-etapa">
                    <span className="numero">03</span>

                    <div className="icone-etapa">
                        <img
                            src="/assets/icons/camiao.png"
                            alt="Retirada dos alimentos"
                        />
                    </div>

                    <h2>Combine a retirada</h2>

                    <p>
                        A instituição confirma a solicitação
                        e combina a retirada dos alimentos com o doador.
                    </p>
                </div>

            </div>

            <div className="chamada-final">
                <h2>Juntos, podemos fazer a diferença!</h2>

                <p>
                    Cada doação é uma oportunidade de ajudar
                    e evitar o desperdício de alimentos.
                </p>

                <Link to="/Criar" className="botao-participar">
                    Quero fazer parte
                    <span> →</span>
                </Link>
            </div>

        </section>
    )
}
