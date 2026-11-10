
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatarData, formatarQuantidade } from '../../lib/formato';
import './index.scss';

export default function Doacoes() {
    const [doacoes, setDoacoes] = useState([]);
    const [busca, setBusca] = useState('');
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregarDoacoes() {
            try {
                const dados = await api.listarDoacoesDisponiveis();
                setDoacoes(Array.isArray(dados) ? dados : []);
            } catch (falha) {
                setErro(falha.message);
            }
        }

        carregarDoacoes();
    }, []);

    const doacoesFiltradas = doacoes.filter((doacao) =>
        `${doacao.nome_alimento || ''} 
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
                    {erro && <p className="sem-doacoes">{erro}</p>}
                    {doacoesFiltradas.length > 0 ? (
                        doacoesFiltradas.map((doacao) => (
                            <div className="card-doacao" key={doacao.id}>
                                <div className="icone-doacao">♡</div>

                                <h2>
                                    {doacao.nome_alimento || 'Alimentos disponíveis'}
                                </h2>

                                <p>
                                    <strong>Quantidade:</strong>{' '}
                                    {formatarQuantidade(doacao.quantidade, doacao.unidade)}
                                </p>

                                <p>
                                    <strong>Local:</strong>{' '}
                                    {[doacao.cidade, doacao.estado]
                                        .filter(Boolean)
                                        .join(' - ') || 'Não informado'}
                                </p>

                                <p>
                                    {doacao.observacoes ||
                                        'Alimentos disponíveis para ajudar instituições.'}
                                </p>

                                {doacao.validade && (
                                    <p>
                                        <strong>Validade:</strong>{' '}
                                        {formatarData(doacao.validade)}
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
