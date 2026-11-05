
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

export default function Doacoes() {
    const [doacoes, setDoacoes] = useState([]);
    const [busca, setBusca] = useState('');

    useEffect(() => {
        async function carregarDoacoes() {
            try {
                const resposta = await fetch(
                    'http://localhost:3001/api/doacoes'
                );

                if (!resposta.ok) {
                    throw new Error('Erro ao carregar doações');
                }

                const dados = await resposta.json();
                setDoacoes(Array.isArray(dados) ? dados : dados.doacoes || []);
            } catch (erro) {
                console.error('Erro ao buscar doações:', erro);
            }
        }

        carregarDoacoes();
    }, []);

    const doacoesFiltradas = doacoes.filter((doacao) =>
        `${doacao.alimentos || doacao.nome || ''} 
        ${doacao.cidade || ''} 
        ${doacao.estado || ''} 
        ${doacao.descricao || ''}`
            .toLowerCase()
            .includes(busca.toLowerCase())
    );

    return (
        <div className="pagina-doacoes">
            <header className="doacoes-header">
                <Link to="/">
                    <img
                        src="/assets/images/logo.png"
                        alt="Logo Conecta-Alimento"
                    />
                </Link>

                <Link to="/" className="voltar-inicio">
                    Voltar
                </Link>
            </header>

            <main className="conteudo-doacoes">
                <h1>Doações disponíveis</h1>

                <p className="descricao-doacoes">
                    Confira os alimentos disponíveis para doação
                    e encontre oportunidades para ajudar sua comunidade.
                </p>

                <input
                    type="text"
                    className="busca-doacoes"
                    placeholder="Buscar alimentos ou cidade..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                <div className="lista-doacoes">
                    {doacoesFiltradas.length > 0 ? (
                        doacoesFiltradas.map((doacao) => (
                            <div className="card-doacao" key={doacao.id}>
                                <div className="icone-doacao">♡</div>

                                <h2>
                                    {doacao.alimentos ||
                                        doacao.nome ||
                                        'Alimentos disponíveis'}
                                </h2>

                                <p>
                                    <strong>Quantidade:</strong>{' '}
                                    {doacao.quantidade || 'Não informada'}
                                </p>

                                <p>
                                    <strong>Local:</strong>{' '}
                                    {[doacao.cidade, doacao.estado]
                                        .filter(Boolean)
                                        .join(' - ') || 'Não informado'}
                                </p>

                                <p>
                                    {doacao.descricao ||
                                        'Alimentos disponíveis para ajudar instituições.'}
                                </p>

                                {doacao.validade && (
                                    <p>
                                        <strong>Validade:</strong>{' '}
                                        {new Date(
                                            `${String(doacao.validade).slice(0, 10)}T12:00:00`
                                        ).toLocaleDateString('pt-BR')}
                                    </p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="sem-doacoes">
                            Nenhuma doação encontrada no momento.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
