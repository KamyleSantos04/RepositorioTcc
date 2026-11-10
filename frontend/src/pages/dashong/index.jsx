import { Link, useNavigate } from 'react-router-dom';
import LayoutDashboard from '../../components/layout-dashboard';
import Aviso from '../../components/aviso';
import { api } from '../../lib/api';
import { formatarQuantidade } from '../../lib/formato';
import { TIPO_ONG } from '../../lib/sessao';
import useProtecao from '../../hooks/useProtecao';
import useRequisicao from '../../hooks/useRequisicao';
import './index.scss';

function CartaoResumo({ para, classe, valor, rotulo }) {
    return (
        <Link to={para} className={`dash-cartao ${classe}`}>
            <h2>{valor}</h2>
            <p>{rotulo}</p>
        </Link>
    );
}

export default function DashboardONG() {
    const sessao = useProtecao(TIPO_ONG);
    const navegar = useNavigate();

    const { dados, carregando, erro, recarregar } = useRequisicao(async () => {
        const [instituicao, resumo, doacoes] = await Promise.all([
            api.minhaInstituicao(),
            api.resumoSolicitacoes(),
            api.listarDoacoesDisponiveis()
        ]);

        return { instituicao, resumo, doacoes };
    }, [], Boolean(sessao));

    if (!sessao) return null;

    const instituicao = dados?.instituicao;
    const resumo = dados?.resumo || {};
    const doacoes = (dados?.doacoes || []).slice(0, 4);
    const nome = instituicao?.nome || sessao.nome || 'instituição';

    return (
        <LayoutDashboard tipo={TIPO_ONG}>
            <header className="dash-cabecalho">
                <div>
                    <h1>Olá, {nome}!</h1>
                    <p>
                        Este é o painel da sua instituição no Conecta-Alimento.
                        Acompanhe suas solicitações e encontre alimentos
                        disponíveis para doação.
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
                    <Link
                        to="/DashONG/BuscarDoacoes"
                        className="dash-botao"
                    >
                        Buscar doações
                    </Link>
                </div>
            </header>

            <Aviso tipo="erro">{erro}</Aviso>

            <section className="dash-cartoes">
                <CartaoResumo
                    para="/DashONG/Solicitacoes"
                    classe="terracota"
                    valor={resumo.solicitacoes_pendentes ?? 0}
                    rotulo="Solicitações aguardando resposta"
                />
                <CartaoResumo
                    para="/DashONG/Recebimentos"
                    classe="areia"
                    valor={resumo.solicitacoes_aceitas ?? 0}
                    rotulo="Doações liberadas para retirada"
                />
                <CartaoResumo
                    para="/DashONG/Historico"
                    classe="verde"
                    valor={resumo.solicitacoes_concluidas ?? 0}
                    rotulo="Doações recebidas"
                />
                <CartaoResumo
                    para="/DashONG/Historico"
                    classe="oliva"
                    valor={formatarQuantidade(resumo.quantidade_recebida, '')}
                    rotulo="Quantidade total recebida"
                />
            </section>

            <section className="dash-grade">
                <div className="dash-painel">
                    <div className="dash-painel-topo">
                        <h2>Doações disponíveis agora</h2>
                        <Link to="/DashONG/BuscarDoacoes">Ver todas</Link>
                    </div>

                    {carregando && (
                        <p className="dash-carregando">Carregando doações…</p>
                    )}

                    {!carregando && doacoes.length === 0 && (
                        <p className="dash-carregando">
                            Nenhuma doação disponível neste momento. Assim que
                            um estabelecimento publicar um excedente, ele
                            aparecerá aqui.
                        </p>
                    )}

                    <div className="dash-lista">
                        {doacoes.map((doacao) => (
                            <div className="dash-linha" key={doacao.id}>
                                <div className="dash-linha-info">
                                    <h3>{doacao.nome_alimento}</h3>
                                    <p>
                                        {formatarQuantidade(
                                            doacao.quantidade,
                                            doacao.unidade
                                        )}
                                        {' · '}
                                        {doacao.estabelecimento}
                                        {doacao.cidade
                                            ? ` · ${doacao.cidade}`
                                            : ''}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="dash-botao dash-botao-pequeno"
                                    onClick={() =>
                                        navegar('/DashONG/BuscarDoacoes')
                                    }
                                >
                                    Ver
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dash-painel">
                    <div className="dash-painel-topo">
                        <h2>Dados da instituição</h2>
                        <Link to="/DashONG/Perfil">Editar</Link>
                    </div>

                    {carregando && (
                        <p className="dash-carregando">Carregando dados…</p>
                    )}

                    {!carregando && instituicao && (
                        <ul className="meta dashong-dados">
                            <li>
                                <strong>Pessoas atendidas:</strong>{' '}
                                {instituicao.pessoas_atendidas || '—'}
                            </li>
                            <li>
                                <strong>Frequência:</strong>{' '}
                                {instituicao.frequencia_doacao || '—'}
                            </li>
                            <li>
                                <strong>Cidade:</strong>{' '}
                                {[instituicao.cidade, instituicao.estado]
                                    .filter(Boolean)
                                    .join(' - ') || '—'}
                            </li>
                            <li>
                                <strong>Estabelecimentos parceiros:</strong>{' '}
                                {resumo.estabelecimentos_parceiros ?? 0}
                            </li>
                            <li>
                                <strong>Alimentos necessários:</strong>{' '}
                                {instituicao.alimentos_necessarios || '—'}
                            </li>
                        </ul>
                    )}
                </div>
            </section>
        </LayoutDashboard>
    );
}
