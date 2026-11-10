import { useMemo, useState } from 'react';
import LayoutDashboard from '../../../components/layout-dashboard';
import CartaoDoacao from '../../../components/cartao-doacao';
import Aviso from '../../../components/aviso';
import EstadoVazio from '../../../components/estado-vazio';
import { api } from '../../../lib/api';
import { TIPO_ONG } from '../../../lib/sessao';
import useProtecao from '../../../hooks/useProtecao';
import useRequisicao from '../../../hooks/useRequisicao';

const STATUS_ABERTOS = ['PENDENTE', 'ACEITA'];
const LISTA_VAZIA = [];

export default function BuscarDoacoes() {
    const sessao = useProtecao(TIPO_ONG);

    const { dados, carregando, erro, recarregar, definirErro } =
        useRequisicao(async () => {
            const [doacoes, solicitacoes] = await Promise.all([
                api.listarDoacoesDisponiveis(),
                api.minhasSolicitacoes()
            ]);

            return { doacoes, solicitacoes };
        }, [], Boolean(sessao));

    const [busca, setBusca] = useState('');
    const [detalhada, setDetalhada] = useState(null);
    const [mensagem, setMensagem] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [sucesso, setSucesso] = useState('');

    const doacoes = dados?.doacoes || LISTA_VAZIA;
    const solicitacoes = dados?.solicitacoes || LISTA_VAZIA;

    const solicitadas = useMemo(
        () =>
            new Set(
                solicitacoes
                    .filter((s) => STATUS_ABERTOS.includes(s.status))
                    .map((s) => s.doacao_id)
            ),
        [solicitacoes]
    );

    const filtradas = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return doacoes;

        return doacoes.filter((doacao) =>
            [
                doacao.nome_alimento,
                doacao.categoria,
                doacao.cidade,
                doacao.estado,
                doacao.estabelecimento
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(termo)
        );
    }, [doacoes, busca]);

    if (!sessao) return null;

    function abrirDetalhes(doacao) {
        setDetalhada(doacao);
        setMensagem('');
        setSucesso('');
    }

    async function solicitar(doacao) {
        setEnviando(true);
        definirErro('');
        setSucesso('');

        try {
            await api.solicitarDoacao(doacao.id, mensagem.trim());
            setSucesso(
                `Solicitação enviada para ${
                    doacao.estabelecimento || 'o estabelecimento'
                }! Acompanhe a resposta em "Solicitações".`
            );
            setDetalhada(null);
            setMensagem('');
            await recarregar();
        } catch (falha) {
            definirErro(falha.message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <LayoutDashboard tipo={TIPO_ONG}>
            <header className="dash-cabecalho">
                <div>
                    <h1>Buscar doações</h1>
                    <p>
                        Alimentos disponibilizados pelos estabelecimentos
                        parceiros. Escolha uma doação e envie sua solicitação.
                    </p>
                </div>

                <div className="dash-cabecalho-acoes">
                    <button
                        type="button"
                        className="dash-botao dash-botao-claro"
                        onClick={recarregar}
                        disabled={carregando}
                    >
                        Atualizar
                    </button>
                </div>
            </header>

            <Aviso tipo="erro">{erro}</Aviso>
            <Aviso tipo="sucesso">{sucesso}</Aviso>

            {detalhada && (
                <section className="dash-painel">
                    <div className="dash-painel-topo">
                        <h2>Solicitar: {detalhada.nome_alimento}</h2>
                        <button
                            type="button"
                            className="dash-botao dash-botao-claro dash-botao-pequeno"
                            onClick={() => setDetalhada(null)}
                        >
                            Cancelar
                        </button>
                    </div>

                    <ul className="meta">
                        <li>
                            <strong>Doador:</strong>{' '}
                            {detalhada.estabelecimento || '—'}
                        </li>
                        <li>
                            <strong>Local de retirada:</strong>{' '}
                            {detalhada.endereco_retirada || '—'}
                        </li>
                        <li>
                            <strong>Quantidade:</strong>{' '}
                            {detalhada.quantidade} {detalhada.unidade}
                        </li>
                    </ul>

                    <div className="dash-campo" style={{ marginTop: '16px' }}>
                        <label htmlFor="mensagem-solicitacao">
                            Mensagem para o estabelecimento (opcional)
                        </label>
                        <textarea
                            id="mensagem-solicitacao"
                            placeholder="Ex.: Podemos retirar hoje até as 15h."
                            maxLength={500}
                            value={mensagem}
                            onChange={(evento) =>
                                setMensagem(evento.target.value)
                            }
                        />
                    </div>

                    <div className="dash-acoes">
                        <button
                            type="button"
                            className="dash-botao"
                            onClick={() => solicitar(detalhada)}
                            disabled={enviando}
                        >
                            {enviando ? 'Enviando…' : 'Confirmar solicitação'}
                        </button>
                    </div>
                </section>
            )}

            <div className="dash-busca">
                <input
                    type="search"
                    placeholder="Buscar alimento, categoria ou cidade…"
                    value={busca}
                    onChange={(evento) => setBusca(evento.target.value)}
                />
                <span>
                    {filtradas.length}{' '}
                    {filtradas.length === 1
                        ? 'doação encontrada'
                        : 'doações encontradas'}
                </span>
            </div>

            {carregando ? (
                <p className="dash-carregando">Carregando doações…</p>
            ) : filtradas.length === 0 ? (
                <div className="dash-painel">
                    <EstadoVazio
                        titulo="Nenhuma doação disponível"
                        descricao="Assim que um estabelecimento publicar um excedente, ele aparecerá aqui automaticamente."
                    />
                </div>
            ) : (
                <div className="dash-grade-cards">
                    {filtradas.map((doacao) => {
                        const jaSolicitada = solicitadas.has(doacao.id);

                        return (
                            <CartaoDoacao
                                key={doacao.id}
                                doacao={doacao}
                                mostrarEndereco
                                acoes={
                                    <button
                                        type="button"
                                        className="dash-botao dash-botao-pequeno"
                                        onClick={() => abrirDetalhes(doacao)}
                                        disabled={jaSolicitada}
                                    >
                                        {jaSolicitada
                                            ? 'Já solicitada'
                                            : 'Solicitar doação'}
                                    </button>
                                }
                            />
                        );
                    })}
                </div>
            )}
        </LayoutDashboard>
    );
}
