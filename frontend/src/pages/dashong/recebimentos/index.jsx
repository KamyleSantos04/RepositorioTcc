import { useMemo, useState } from 'react';
import LayoutDashboard from '../../../components/layout-dashboard';
import CartaoSolicitacao from '../../../components/cartao-solicitacao';
import Aviso from '../../../components/aviso';
import EstadoVazio from '../../../components/estado-vazio';
import { api } from '../../../lib/api';
import { TIPO_ONG } from '../../../lib/sessao';
import useProtecao from '../../../hooks/useProtecao';
import useRequisicao from '../../../hooks/useRequisicao';

const LISTA_VAZIA = [];

export default function Recebimentos() {
    const sessao = useProtecao(TIPO_ONG);

    const { dados, carregando, erro, recarregar, definirErro } =
        useRequisicao(() => api.minhasSolicitacoes(), [], Boolean(sessao));

    const [sucesso, setSucesso] = useState('');
    const [confirmando, setConfirmando] = useState(null);

    const solicitacoes = dados || LISTA_VAZIA;

    const aguardandoRetirada = useMemo(
        () => solicitacoes.filter((item) => item.status === 'ACEITA'),
        [solicitacoes]
    );

    const recebidas = useMemo(
        () => solicitacoes.filter((item) => item.status === 'CONCLUIDA'),
        [solicitacoes]
    );

    if (!sessao) return null;

    async function confirmarRetirada(solicitacao) {
        setConfirmando(solicitacao.id);
        definirErro('');
        setSucesso('');

        try {
            await api.concluirSolicitacao(solicitacao.id);
            setSucesso(
                `Retirada de ${solicitacao.nome_alimento} confirmada com sucesso!`
            );
            await recarregar();
        } catch (falha) {
            definirErro(falha.message);
        } finally {
            setConfirmando(null);
        }
    }

    return (
        <LayoutDashboard tipo={TIPO_ONG}>
            <header className="dash-cabecalho">
                <div>
                    <h1>Recebimentos</h1>
                    <p>
                        Doações que o estabelecimento liberou para retirada e
                        alimentos que a instituição já recebeu.
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

            {carregando ? (
                <p className="dash-carregando">Carregando recebimentos…</p>
            ) : (
                <>
                    <section className="dash-painel">
                        <div className="dash-painel-topo">
                            <h2>
                                Prontas para retirada (
                                {aguardandoRetirada.length})
                            </h2>
                        </div>

                        {aguardandoRetirada.length === 0 ? (
                            <EstadoVazio
                                titulo="Nenhuma doação aguardando retirada"
                                descricao="Quando um estabelecimento aceitar uma das suas solicitações, ela aparecerá aqui para você confirmar o recebimento."
                            />
                        ) : (
                            <div className="dash-grade-2">
                                {aguardandoRetirada.map((solicitacao) => (
                                    <CartaoSolicitacao
                                        key={solicitacao.id}
                                        solicitacao={solicitacao}
                                        mostrarContato
                                        acoes={
                                            <button
                                                type="button"
                                                className="dash-botao"
                                                onClick={() =>
                                                    confirmarRetirada(
                                                        solicitacao
                                                    )
                                                }
                                                disabled={
                                                    confirmando === solicitacao.id
                                                }
                                            >
                                                {confirmando === solicitacao.id
                                                    ? 'Confirmando…'
                                                    : 'Confirmar retirada'}
                                            </button>
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="dash-painel">
                        <div className="dash-painel-topo">
                            <h2>Já recebidas ({recebidas.length})</h2>
                        </div>

                        {recebidas.length === 0 ? (
                            <EstadoVazio
                                titulo="Nenhum recebimento registrado"
                                descricao="As doações confirmadas ficam registradas aqui e no Histórico."
                            />
                        ) : (
                            <table className="dash-tabela">
                                <thead>
                                    <tr>
                                        <th>Alimento</th>
                                        <th>Quantidade</th>
                                        <th>Estabelecimento</th>
                                        <th>Solicitado em</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recebidas.map((solicitacao) => (
                                        <tr key={solicitacao.id}>
                                            <td>{solicitacao.nome_alimento}</td>
                                            <td>
                                                {solicitacao.quantidade}{' '}
                                                {solicitacao.unidade}
                                            </td>
                                            <td>
                                                {solicitacao.estabelecimento ||
                                                    '—'}
                                            </td>
                                            <td>
                                                {new Date(
                                                    solicitacao.criado_em
                                                ).toLocaleDateString('pt-BR')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                </>
            )}
        </LayoutDashboard>
    );
}
