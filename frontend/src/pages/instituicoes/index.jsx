
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import './index.scss';

export default function Instituicoes() {
    const [instituicoes, setInstituicoes] = useState([]);
    const [busca, setBusca] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregarInstituicoes() {
            try {
                const dados = await api.listarInstituicoes();
                setInstituicoes(Array.isArray(dados) ? dados : []);
            } catch (falha) {
                setErro(falha.message);
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
