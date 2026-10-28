import { useState } from "react";
import { Link } from "react-router-dom";
import "./index.scss";



const instituicoes = [
    {
        nome: "Abrigo Nosso Lar",
        cidade: "São Paulo - SP",
        descricao:
            "Oferece alimentação e acolhimento para pessoas em situação de vulnerabilidade.",
        icone: "111.png",
    },
    {
        nome: "Abrigo Esperança",
        cidade: "Rio de Janeiro - RJ",
        descricao:
            "Acolhe pessoas que precisam de apoio e ajuda com alimentação.",
        icone: "66.png",
    },
    {
        nome: "Casa de Acolhimento Vida Nova",
        cidade: "Belo Horizonte - MG",
        descricao:
            "Oferece acolhimento e refeições para pessoas em situação de vulnerabilidade.",
        icone: "88.png",
    },
];

export default function Instituicoes() {
    const [busca, setBusca] = useState("");

    const resultado = instituicoes.filter((instituicao) =>
        `${instituicao.nome} ${instituicao.cidade}`
            .toLowerCase()
            .includes(busca.toLowerCase())
    );

    return (
        <main className="institutions-page">
           <header className="institution-header">
    <Link to="/" className="institution-brand">
        <img
            src="/assets/images/logo.png"
            alt="Alimento que Conecta"
        />
    </Link>

    <Link to="/" className="institution-back-button">
        Voltar para o início
    </Link>
</header>

            <section className="institution-results">
                <h1>Instituições</h1>

                <p>
                    Conheça instituições que precisam de apoio para levar
                    alimentos a quem mais precisa.
                </p>

                <div className="institution-search">
                    <input
                        type="search"
                        placeholder="Buscar instituição ou cidade..."
                        value={busca}
                        onChange={(e) =>
                            setBusca(e.target.value)
                        }
                    />
                </div>

                <p className="institution-count">
                    {resultado.length} instituições encontradas
                </p>

                <div className="institution-cards">
                    {resultado.map((instituicao) => (
                        <article
                            className="institution-card"
                            key={instituicao.nome}
                        >
                            <div className="institution-card-heading">
                                <div className="institution-card-icon">
                                    <img
                                        src='' alt=""
                                    />
                                </div>

                                <div>
                                    <h3>{instituicao.nome}</h3>

                                    <p className="institution-location">
                                        {instituicao.cidade}
                                    </p>
                                </div>
                            </div>

                            <p className="institution-description">
                                {instituicao.descricao}
                            </p>

                            <Link to="/QueroDoar" className="institution-donate-button"> ♡ Contribuir</Link>
                        </article>
                    ))}
                </div>

                {resultado.length === 0 && (
                    <p>
                        Nenhuma instituição encontrada. Tente outra busca.
                    </p>
                )}
            </section>
        </main>
    );
}