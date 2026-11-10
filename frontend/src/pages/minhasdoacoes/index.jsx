import { useState } from 'react';
import { Link } from 'react-router-dom';
import LayoutDashboard from '../../components/layout-dashboard';
import CartaoDoacao from '../../components/cartao-doacao';
import Aviso from '../../components/aviso';
import EstadoVazio from '../../components/estado-vazio';
import { api } from '../../lib/api';
import { TIPO_ESTABELECIMENTO } from '../../lib/sessao';
import useProtecao from '../../hooks/useProtecao';
import useRequisicao from '../../hooks/useRequisicao';

export default function MinhasDoacoes() {
    const sessao = useProtecao(TIPO_ESTABELECIMENTO);
    const { dados, carregando, erro, recarregar, definirErro } = useRequisicao(
        () => api.minhasDoacoes(),
        [],
        Boolean(sessao)
    );
    const [sucesso, setSucesso] = useState('');
    const [processando, setProcessando] = useState(null);

    if (!sessao) return null;

    const doacoes = dados || [];

    async function atualizar(doacao, status) {
        setProcessando(`${doacao.id}-${status}`);
        setSucesso('');
        definirErro('');

        try {
            await api.atualizarStatusDoacao(doacao.id, status);
            setSucesso(`Doação “${doacao.nome_alimento}” atualizada com sucesso!`);
            await recarregar();
        } catch (falha) {
            definirErro(falha.message);
        } finally {
            setProcessando(null);
        }
    }

    async function remover(doacao) {
        setProcessando(`${doacao.id}-remover`);
        setSucesso('');
        definirErro('');

        try {
            await api.removerDoacao(doacao.id);
            setSucesso(`Doação “${doacao.nome_alimento}” removida com sucesso!`);
            await recarregar();
        } catch (falha) {
            definirErro(falha.message);
        } finally {
            setProcessando(null);
        }
    }

    return (
        <LayoutDashboard tipo={TIPO_ESTABELECIMENTO}>
            <header className="dash-cabecalho">
                <div>
                    <h1>Minhas doações</h1>
                    <p>Gerencie os alimentos publicados e acompanhe as solicitações recebidas.</p>
                </div>
                <div className="dash-cabecalho-acoes">
                    <button className="dash-botao dash-botao-claro" type="button" onClick={recarregar} disabled={carregando}>Atualizar</button>
                    <Link className="dash-botao" to="/CadastrarAlimento">Cadastrar alimento</Link>
                </div>
            </header>

            <Aviso tipo="erro">{erro}</Aviso>
            <Aviso tipo="sucesso">{sucesso}</Aviso>

            {carregando ? (
                <p className="dash-carregando">Carregando suas doações…</p>
            ) : doacoes.length === 0 ? (
                <div className="dash-painel">
                    <EstadoVazio
                        titulo="Você ainda não publicou doações"
                        descricao="Cadastre um alimento disponível para que as instituições possam encontrá-lo."
                        acao={<Link className="dash-botao dash-botao-pequeno" to="/CadastrarAlimento">Cadastrar alimento</Link>}
                    />
                </div>
            ) : (
                <div className="dash-grade-cards">
                    {doacoes.map((doacao) => {
                        const podeCancelar = doacao.status === 'DISPONIVEL';
                        const podeRemover = doacao.status === 'DISPONIVEL' && Number(doacao.total_solicitacoes || 0) === 0;

                        return (
                            <CartaoDoacao
                                key={doacao.id}
                                doacao={doacao}
                                mostrarEndereco
                                acoes={
                                    <div className="dash-acoes">
                                        {Number(doacao.total_solicitacoes || 0) > 0 && (
                                            <Link className="dash-botao dash-botao-claro dash-botao-pequeno" to="/Solicitacoes">
                                                {doacao.total_solicitacoes} solicitação(ões)
                                            </Link>
                                        )}
                                        {podeCancelar && (
                                            <button
                                                type="button"
                                                className="dash-botao dash-botao-secundario dash-botao-pequeno"
                                                onClick={() => atualizar(doacao, 'CANCELADA')}
                                                disabled={Boolean(processando)}
                                            >
                                                {processando === `${doacao.id}-CANCELADA` ? 'Cancelando…' : 'Cancelar'}
                                            </button>
                                        )}
                                        {podeRemover && (
                                            <button
                                                type="button"
                                                className="dash-botao dash-botao-perigo dash-botao-pequeno"
                                                onClick={() => remover(doacao)}
                                                disabled={Boolean(processando)}
                                            >
                                                {processando === `${doacao.id}-remover` ? 'Removendo…' : 'Remover'}
                                            </button>
                                        )}
                                    </div>
                                }
                            />
                        );
                    })}
                </div>
            )}
        </LayoutDashboard>
    );
}
