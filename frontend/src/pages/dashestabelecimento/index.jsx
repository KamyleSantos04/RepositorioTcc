import { Link } from 'react-router-dom';
import LayoutDashboard from '../../components/layout-dashboard';
import Aviso from '../../components/aviso';
import EstadoVazio from '../../components/estado-vazio';
import EtiquetaStatus from '../../components/etiqueta-status';
import { api } from '../../lib/api';
import { formatarQuantidade, formatarHorario } from '../../lib/formato';
import { TIPO_ESTABELECIMENTO } from '../../lib/sessao';
import useProtecao from '../../hooks/useProtecao';
import useRequisicao from '../../hooks/useRequisicao';

function CartaoResumo({ para, classe, valor, rotulo }) {
    return (
        <Link to={para} className={`dash-cartao ${classe}`}>
            <h2>{valor}</h2>
            <p>{rotulo}</p>
        </Link>
    );
}

export default function Dashboard() {
    const sessao = useProtecao(TIPO_ESTABELECIMENTO);
    const { dados, carregando, erro, recarregar } = useRequisicao(
        async () => {
            const [estabelecimento, resumo, doacoes] = await Promise.all([
                api.meuEstabelecimento(),
                api.resumoDoacoes(),
                api.minhasDoacoes()
            ]);

            return { estabelecimento, resumo, doacoes };
        },
        [],
        Boolean(sessao)
    );

    if (!sessao) return null;

    const estabelecimento = dados?.estabelecimento;
    const resumo = dados?.resumo || {};
    const doacoes = dados?.doacoes || [];
    const recentes = doacoes.slice(0, 4);
    const totalDoacoes = [
        resumo.doacoes_ativas,
        resumo.doacoes_reservadas,
        resumo.doacoes_concluidas,
        resumo.doacoes_canceladas
    ].reduce((total, valor) => total + Number(valor || 0), 0);
    const percentualConcluido = totalDoacoes
        ? Math.round((Number(resumo.doacoes_concluidas || 0) / totalDoacoes) * 100)
        : 0;

    return (
        <LayoutDashboard tipo={TIPO_ESTABELECIMENTO}>
            <header className="dash-cabecalho">
                <div>
                    <h1>Bem-vindo, {estabelecimento?.nome || sessao.nome || 'estabelecimento'}!</h1>
                    <p>Acompanhe as doações e as solicitações recebidas pela sua empresa.</p>
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
                    <Link className="dash-botao" to="/CadastrarAlimento">
                        Cadastrar alimento
                    </Link>
                </div>
            </header>

            <Aviso tipo="erro">{erro}</Aviso>

            <section className="dash-cartoes">
                <CartaoResumo
                    para="/MinhasDoacoes"
                    classe="verde"
                    valor={resumo.doacoes_ativas ?? 0}
                    rotulo="Doações ativas"
                />
                <CartaoResumo
                    para="/Solicitacoes"
                    classe="terracota"
                    valor={resumo.solicitacoes_pendentes ?? 0}
                    rotulo="Solicitações aguardando resposta"
                />
                <CartaoResumo
                    para="/Historico"
                    classe="oliva"
                    valor={resumo.doacoes_concluidas ?? 0}
                    rotulo="Doações concluídas"
                />
                <CartaoResumo
                    para="/Historico"
                    classe="areia"
                    valor={formatarQuantidade(resumo.quantidade_destinada, '')}
                    rotulo="Quantidade destinada"
                />
            </section>

            <section className="dash-grade">
                <div className="dash-painel">
                    <div className="dash-painel-topo">
                        <h2>Doações recentes</h2>
                        <Link to="/MinhasDoacoes">Ver todas</Link>
                    </div>

                    {carregando ? (
                        <p className="dash-carregando">Carregando doações…</p>
                    ) : recentes.length === 0 ? (
                        <EstadoVazio
                            titulo="Nenhuma doação publicada"
                            descricao="Quando você cadastrar um alimento, ele aparecerá aqui e poderá ser encontrado pelas instituições."
                            acao={<Link className="dash-botao dash-botao-pequeno" to="/CadastrarAlimento">Cadastrar alimento</Link>}
                        />
                    ) : (
                        <div className="dash-lista">
                            {recentes.map((doacao) => (
                                <div className="dash-linha" key={doacao.id}>
                                    <div className="dash-linha-info">
                                        <h3>{doacao.nome_alimento}</h3>
                                        <p>
                                            {formatarQuantidade(doacao.quantidade, doacao.unidade)}
                                            {doacao.retirada_ate
                                                ? ` · Retirada até ${formatarHorario(doacao.retirada_ate)}`
                                                : ''}
                                        </p>
                                    </div>
                                    <EtiquetaStatus status={doacao.status} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dash-painel">
                    <div className="dash-painel-topo">
                        <h2>Seu impacto</h2>
                        <Link to="/Historico">Ver histórico</Link>
                    </div>

                    <p className="dash-carregando">
                        {carregando
                            ? 'Calculando dados…'
                            : `${percentualConcluido}% das suas doações publicadas já foram concluídas.`}
                    </p>
                    <div className="dash-barra" aria-label={`${percentualConcluido}% concluído`}>
                        <span style={{ width: `${percentualConcluido}%` }} />
                    </div>
                    <ul className="meta" style={{ marginTop: '18px', flexDirection: 'column' }}>
                        <li><strong>Reservadas:</strong> {resumo.doacoes_reservadas ?? 0}</li>
                        <li><strong>Canceladas:</strong> {resumo.doacoes_canceladas ?? 0}</li>
                        <li><strong>Estabelecimento:</strong> {estabelecimento?.cidade || '—'}{estabelecimento?.estado ? ` - ${estabelecimento.estado}` : ''}</li>
                    </ul>
                </div>
            </section>
        </LayoutDashboard>
    );
}
