import { useMemo, useState } from 'react';
import LayoutDashboard from '../../../components/layout-dashboard';
import CartaoSolicitacao from '../../../components/cartao-solicitacao';
import Aviso from '../../../components/aviso';
import EstadoVazio from '../../../components/estado-vazio';
import { api } from '../../../lib/api';
import { TIPO_ONG } from '../../../lib/sessao';
import useProtecao from '../../../hooks/useProtecao';
import useRequisicao from '../../../hooks/useRequisicao';

const FILTROS = [
    { valor: 'TODAS', rotulo: 'Todas' },
    { valor: 'PENDENTE', rotulo: 'Aguardando resposta' },
    { valor: 'ACEITA', rotulo: 'Aceitas' },
    { valor: 'RECUSADA', rotulo: 'Recusadas' },
    { valor: 'CONCLUIDA', rotulo: 'Concluídas' }
];
const LISTA_VAZIA = [];

export default function SolicitacoesOng() {
    const sessao = useProtecao(TIPO_ONG);
    const [filtro, setFiltro] = useState('TODAS');

    const { dados, carregando, erro, recarregar } = useRequisicao(
        () => api.minhasSolicitacoes(),
        [],
        Boolean(sessao)
    );

    const solicitacoes = dados || LISTA_VAZIA;

    const lista = useMemo(
        () =>
            filtro === 'TODAS'
                ? solicitacoes
                : solicitacoes.filter((item) => item.status === filtro),
        [solicitacoes, filtro]
    );

    if (!sessao) return null;

    return (
        <LayoutDashboard tipo={TIPO_ONG}>
            <header className="dash-cabecalho">
                <div>
                    <h1>Solicitações</h1>
                    <p>
                        Acompanhe o andamento de cada doação solicitada pela
                        sua instituição.
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

            <div className="dash-filtros">
                {FILTROS.map((item) => (
                    <button
                        key={item.valor}
                        type="button"
                        className={
                            filtro === item.valor
                                ? 'dash-filtro ativo'
                                : 'dash-filtro'
                        }
                        onClick={() => setFiltro(item.valor)}
                    >
                        {item.rotulo}
                    </button>
                ))}
            </div>

            {carregando ? (
                <p className="dash-carregando">Carregando solicitações…</p>
            ) : lista.length === 0 ? (
                <div className="dash-painel">
                    <EstadoVazio
                        titulo="Nenhuma solicitação aqui"
                        descricao="Use a página Buscar Doações para solicitar alimentos disponíveis."
                    />
                </div>
            ) : (
                <div className="dash-grade-cards">
                    {lista.map((solicitacao) => (
                        <CartaoSolicitacao
                            key={solicitacao.id}
                            solicitacao={solicitacao}
                        />
                    ))}
                </div>
            )}
        </LayoutDashboard>
    );
}
