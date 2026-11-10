import { useMemo, useState } from 'react';
import LayoutDashboard from '../../components/layout-dashboard';
import CartaoSolicitacao from '../../components/cartao-solicitacao';
import Aviso from '../../components/aviso';
import EstadoVazio from '../../components/estado-vazio';
import { api } from '../../lib/api';
import { TIPO_ESTABELECIMENTO } from '../../lib/sessao';
import useProtecao from '../../hooks/useProtecao';
import useRequisicao from '../../hooks/useRequisicao';

const LISTA_VAZIA = [];

export default function Solicitacoes() {
    const sessao = useProtecao(TIPO_ESTABELECIMENTO);
    const { dados, carregando, erro, recarregar, definirErro } = useRequisicao(
        () => api.solicitacoesRecebidas(),
        [],
        Boolean(sessao)
    );
    const [sucesso, setSucesso] = useState('');
    const [respondendo, setRespondendo] = useState(null);

    const solicitacoes = dados || LISTA_VAZIA;
    const pendentes = useMemo(
        () => solicitacoes.filter((item) => item.status === 'PENDENTE'),
        [solicitacoes]
    );
    const respondidas = useMemo(
        () => solicitacoes.filter((item) => item.status !== 'PENDENTE'),
        [solicitacoes]
    );

    if (!sessao) return null;

    async function responder(solicitacao, status) {
        setRespondendo(`${solicitacao.id}-${status}`);
        setSucesso('');
        definirErro('');

        try {
            await api.responderSolicitacao(solicitacao.id, status);
            setSucesso(
                status === 'ACEITA'
                    ? `Solicitação de ${solicitacao.instituicao} aceita. A doação está reservada.`
                    : `Solicitação de ${solicitacao.instituicao} recusada.`
            );
            await recarregar();
        } catch (falha) {
            definirErro(falha.message);
        } finally {
            setRespondendo(null);
        }
    }

    return (
        <LayoutDashboard tipo={TIPO_ESTABELECIMENTO}>
            <header className="dash-cabecalho">
                <div>
                    <h1>Solicitações</h1>
                    <p>Analise os pedidos enviados pelas instituições para suas doações.</p>
                </div>
                <button className="dash-botao dash-botao-claro" type="button" onClick={recarregar} disabled={carregando}>Atualizar</button>
            </header>

            <Aviso tipo="erro">{erro}</Aviso>
            <Aviso tipo="sucesso">{sucesso}</Aviso>

            {carregando ? (
                <p className="dash-carregando">Carregando solicitações…</p>
            ) : (
                <>
                    <section className="dash-painel">
                        <div className="dash-painel-topo"><h2>Pendentes ({pendentes.length})</h2></div>
                        {pendentes.length === 0 ? (
                            <EstadoVazio titulo="Nenhuma solicitação pendente" descricao="Novos pedidos de instituições aparecerão aqui." />
                        ) : (
                            <div className="dash-grade-cards">
                                {pendentes.map((solicitacao) => (
                                    <CartaoSolicitacao
                                        key={solicitacao.id}
                                        solicitacao={solicitacao}
                                        acoes={
                                            <>
                                                <button
                                                    type="button"
                                                    className="dash-botao dash-botao-pequeno"
                                                    onClick={() => responder(solicitacao, 'ACEITA')}
                                                    disabled={Boolean(respondendo)}
                                                >
                                                    {respondendo === `${solicitacao.id}-ACEITA` ? 'Aceitando…' : 'Aceitar'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="dash-botao dash-botao-secundario dash-botao-pequeno"
                                                    onClick={() => responder(solicitacao, 'RECUSADA')}
                                                    disabled={Boolean(respondendo)}
                                                >
                                                    {respondendo === `${solicitacao.id}-RECUSADA` ? 'Recusando…' : 'Recusar'}
                                                </button>
                                            </>
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {respondidas.length > 0 && (
                        <section className="dash-painel">
                            <div className="dash-painel-topo"><h2>Respondidas recentemente</h2></div>
                            <div className="dash-grade-cards">
                                {respondidas.map((solicitacao) => <CartaoSolicitacao key={solicitacao.id} solicitacao={solicitacao} />)}
                            </div>
                        </section>
                    )}
                </>
            )}
        </LayoutDashboard>
    );
}
