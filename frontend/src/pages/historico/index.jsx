import LayoutDashboard from '../../components/layout-dashboard';
import Aviso from '../../components/aviso';
import EstadoVazio from '../../components/estado-vazio';
import { api } from '../../lib/api';
import { formatarDataHora, formatarQuantidade } from '../../lib/formato';
import { TIPO_ESTABELECIMENTO } from '../../lib/sessao';
import useProtecao from '../../hooks/useProtecao';
import useRequisicao from '../../hooks/useRequisicao';

export default function Historico() {
    const sessao = useProtecao(TIPO_ESTABELECIMENTO);
    const { dados, carregando, erro, recarregar } = useRequisicao(
        async () => {
            const [doacoes, solicitacoes, resumo] = await Promise.all([
                api.minhasDoacoes(),
                api.solicitacoesRecebidas(),
                api.resumoDoacoes()
            ]);
            return { doacoes, solicitacoes, resumo };
        },
        [],
        Boolean(sessao)
    );

    if (!sessao) return null;

    const resumo = dados?.resumo || {};
    const concluidaPorDoacao = new Map(
        (dados?.solicitacoes || [])
            .filter((item) => item.status === 'CONCLUIDA')
            .map((item) => [item.doacao_id, item])
    );
    const historico = (dados?.doacoes || []).filter((item) =>
        ['CONCLUIDA', 'CANCELADA'].includes(item.status)
    );

    return (
        <LayoutDashboard tipo={TIPO_ESTABELECIMENTO}>
            <header className="dash-cabecalho">
                <div>
                    <h1>Histórico</h1>
                    <p>Consulte as doações concluídas ou canceladas pelo seu estabelecimento.</p>
                </div>
                <button className="dash-botao dash-botao-claro" type="button" onClick={recarregar} disabled={carregando}>Atualizar</button>
            </header>

            <Aviso tipo="erro">{erro}</Aviso>

            <section className="dash-cartoes">
                <div className="dash-cartao verde"><h2>{resumo.doacoes_concluidas ?? 0}</h2><p>Doações concluídas</p></div>
                <div className="dash-cartao oliva"><h2>{formatarQuantidade(resumo.quantidade_destinada, '')}</h2><p>Quantidade destinada</p></div>
                <div className="dash-cartao areia"><h2>{resumo.doacoes_canceladas ?? 0}</h2><p>Doações canceladas</p></div>
                <div className="dash-cartao terracota"><h2>{resumo.solicitacoes_pendentes ?? 0}</h2><p>Solicitações ainda pendentes</p></div>
            </section>

            <section className="dash-painel">
                <div className="dash-painel-topo"><h2>Registros encerrados</h2></div>
                {carregando ? (
                    <p className="dash-carregando">Carregando histórico…</p>
                ) : historico.length === 0 ? (
                    <EstadoVazio titulo="Nenhum registro encerrado" descricao="Doações concluídas e canceladas serão exibidas aqui." />
                ) : (
                    <table className="dash-tabela">
                        <thead>
                            <tr><th>Alimento</th><th>Quantidade</th><th>Destino</th><th>Situação</th><th>Publicado em</th></tr>
                        </thead>
                        <tbody>
                            {historico.map((doacao) => {
                                const solicitacao = concluidaPorDoacao.get(doacao.id);
                                return (
                                    <tr key={doacao.id}>
                                        <td>{doacao.nome_alimento}</td>
                                        <td>{formatarQuantidade(doacao.quantidade, doacao.unidade)}</td>
                                        <td>{solicitacao?.instituicao || (doacao.status === 'CANCELADA' ? '—' : '—')}</td>
                                        <td>{doacao.status === 'CONCLUIDA' ? 'Concluída' : 'Cancelada'}</td>
                                        <td>{formatarDataHora(doacao.criado_em)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </section>
        </LayoutDashboard>
    );
}
