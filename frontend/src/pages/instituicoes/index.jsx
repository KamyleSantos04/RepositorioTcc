
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

export default function Instituicoes() {
    const [instituicoes, setInstituicoes] = useState([]);
    const [busca, setBusca] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregarInstituicoes() {
            try {
                const resposta = await fetch(
                    'http://localhost:3001/api/instituicoes'
                );

                if (!resposta.ok) {
                    throw new Error('Não foi possível carregar as instituições.');
                }

                const dados = await resposta.json();

                setInstituicoes(
                    Array.isArray(dados) ? dados : dados.instituicoes || []
                );
            } catch (erro) {
                console.error(erro);
                setErro('Não foi possível carregar as instituições.');
            } finally {
                setCarregando(false);
            }
        }

        carregarInstituicoes();
    }, []);

    const resultado = instituicoes.filter((instituicao) =>
        `${instituicao.nome || ''} ${instituicao.cidade || ''} ${instituicao.estado || ''}`
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
                 Voltar
                </Link>
            </header>

            <section className="institution-results">
                <h1>Instituições</h1>

                <p>
                    Conheça as instituições cadastradas no Conecta-Alimento.
                </p>

                <input
                    className="institution-search"
                    type="search"
                    placeholder="Buscar instituição ou cidade..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                {carregando && <p>Carregando instituições...</p>}

                {erro && <p>{erro}</p>}

                {!carregando && !erro && (
                    <>
                        <p className="institution-count">
                            {resultado.length} instituições encontradas
                        </p>

                        <div className="institution-cards">
                            {resultado.map((instituicao) => (
                                <article
                                    className="institution-card"
                                    key={instituicao.id}
                                >
                                    <h2>{instituicao.nome}</h2>

                                    <p className="institution-location">
                                        {instituicao.cidade}
                                        {instituicao.estado
                                            ? ` - ${instituicao.estado}`
                                            : ''}
                                    </p>

                                    <p className="institution-description">
                                        {instituicao.descricao ||
                                            'Instituição cadastrada no Conecta-Alimento.'}
                                    </p>
                                </article>
                            ))}
                        </div>

                        {resultado.length === 0 && (
                            <p>
                                Nenhuma instituição encontrada.
                            </p>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}
