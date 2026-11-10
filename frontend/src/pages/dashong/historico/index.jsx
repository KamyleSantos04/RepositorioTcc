import { useMemo } from 'react';
import LayoutDashboard from '../../../components/layout-dashboard';
import Aviso from '../../../components/aviso';
import EstadoVazio from '../../../components/estado-vazio';
import { api } from '../../../lib/api';
import { formatarDataHora, formatarQuantidade } from '../../../lib/formato';
import { TIPO_ONG } from '../../../lib/sessao';
import useProtecao from '../../../hooks/useProtecao';
import useRequisicao from '../../../hooks/useRequisicao';

const LISTA_VAZIA = [];

function CartaoResumo({ classe, valor, rotulo }) {
    return (
        <div className={`dash-cartao ${classe}`}>
            <h2>{valor}</h2>
            <p>{rotulo}</p>
        </div>
    );
}

export default function HistoricoOng() {
    const sessao = useProtecao(TIPO_ONG);

    const { dados, carregando, erro, recarregar } = useRequisicao(async () => {
        const [solicitacoes, resumo] = await Promise.all([
            api.minhasSolicitacoes(),
            api.resumoSolicitacoes()
        ]);

        return { solicitacoes, resumo };
    }, [], Boolean(sessao));

    const solicitacoes = dados?.solicitacoes || LISTA_VAZIA;
    const resumo = dados?.resumo || {};

    const encerradas = useMemo(
        () =>
            solicitacoes.filter((item) =>
                ['CONCLUIDA', 'RECUSADA'].includes(item.status)
            ),
        [solicitacoes]
    );

    if (!sessao) return null;

    return (
        <LayoutDashboard tipo={TIPO_ONG}>
            <header className="dash-cabecalho">
                <div>
                    <h1>Histórico</h1>
                    <p>
                        Registro das solicitações já encerradas — doações
                        recebidas e pedidos recusados pelos estabelecimentos.
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

            <section className="dash-cartoes">
                <CartaoResumo
                    classe="verde"
                    valor={resumo.solicitacoes_concluidas ?? 0}
                    rotulo="Doações recebidas"
                />
                <CartaoResumo
                    classe="oliva"
                    valor={formatarQuantidade(resumo.quantidade_recebida, '')}
                    rotulo="Quantidade total recebida"
                />
                <CartaoResumo
                    classe="areia"
                    valor={resumo.estabelecimentos_parceiros ?? 0}
                    rotulo="Estabelecimentos parceiros"
                />
                <CartaoResumo
                    classe="terracota"
                    valor={resumo.solicitacoes_recusadas ?? 0}
                    rotulo="Solicitações recusadas"
                />
            </section>

            <section className="dash-painel">
                <div className="dash-painel-topo">
                    <h2>Solicitações encerradas</h2>
                </div>

                {carregando ? (
                    <p className="dash-carregando">Carregando histórico…</p>
                ) : encerradas.length === 0 ? (
                    <EstadoVazio
                        titulo="Nenhum registro no histórico"
                        descricao="As doações concluídas e as solicitações recusadas aparecem aqui automaticamente."
                    />
                ) : (
                    <table className="dash-tabela">
                        <thead>
                            <tr>
                                <th>Alimento</th>
                                <th>Quantidade</th>
                                <th>Estabelecimento</th>
                                <th>Situação</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {encerradas.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.nome_alimento}</td>
                                    <td>
                                        {formatarQuantidade(
                                            item.quantidade,
                                            item.unidade
                                        )}
                                    </td>
                                    <td>{item.estabelecimento || '—'}</td>
                                    <td>
                                        {item.status === 'CONCLUIDA'
                                            ? 'Recebida'
                                            : 'Recusada'}
                                    </td>
                                    <td>{formatarDataHora(item.criado_em)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </LayoutDashboard>
    );
}
