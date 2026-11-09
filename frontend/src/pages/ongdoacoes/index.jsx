import { useCallback, useEffect, useMemo, useState } from 'react';
import CartaoDoacao from '../../components/cartao-doacao';
import Painel from '../../components/painel';
import Aviso from '../../components/aviso';
import EstadoVazio from '../../components/estado-vazio';
import { api } from '../../lib/api';
import { TIPO_ONG } from '../../lib/sessao';
import useProtecao from '../../hooks/useProtecao';

export default function OngDoacoes() {
    useProtecao(TIPO_ONG);

    const [doacoes, setDoacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [busca, setBusca] = useState('');
    const [selecionada, setSelecionada] = useState(null);
    const [mensagem, setMensagem] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [sucesso, setSucesso] = useState('');

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro('');

        try {
            const dados = await api.listarDoacoesDisponiveis();
            setDoacoes(Array.isArray(dados) ? dados : []);
        } catch (falha) {
            setErro(falha.message);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

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

    function abrirSolicitacao(doacao) {
        setSelecionada(doacao);
        setMensagem('');
        setSucesso('');
        setErro('');
    }

    function fecharSolicitacao() {
        setSelecionada(null);
        setMensagem('');
    }

    async function confirmarSolicitacao() {
        if (!selecionada) return;

        setEnviando(true);
        setErro('');
        setSucesso('');

        try {
            await api.solicitarDoacao(selecionada.id, mensagem.trim());
            setSucesso(
                `Solicitação enviada para ${selecionada.estabelecimento || 'o estabelecimento'}!`
            );
            setSelecionada(null);
            setMensagem('');
            await carregar();
        } catch (falha) {
            setErro(falha.message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <Painel
            titulo="Doações disponíveis"
            subtitulo="Encontre alimentos oferecidos por estabelecimentos perto da sua instituição."
            acoes={
                <button
                    type="button"
                    className="botao botao-claro"
                    onClick={carregar}
                    disabled={carregando}
                >
                    Atualizar
                </button>
            }
        >
            <Aviso tipo="erro">{erro}</Aviso>
            <Aviso tipo="sucesso">{sucesso}</Aviso>

            {selecionada && (
                <section className="cartao solicitacao-painel">
                    <div className="cartao-titulo">
                        <h2>Solicitar: {selecionada.nome_alimento}</h2>
                        <button
                            type="button"
                            className="botao botao-claro botao-pequeno"
                            onClick={fecharSolicitacao}
                        >
                            Cancelar
                        </button>
                    </div>

                    <div className="campo">
                        <label htmlFor="mensagemSolicitacao">
                            Mensagem para o estabelecimento (opcional)
                        </label>
                        <textarea
                            id="mensagemSolicitacao"
                            placeholder="Ex.: Podemos retirar hoje até as 15h."
                            value={mensagem}
                            onChange={(evento) => setMensagem(evento.target.value)}
                            maxLength={500}
                        />
                    </div>

                    <div className="acoes-formulario">
                        <button
                            type="button"
                            className="botao botao-principal"
                            onClick={confirmarSolicitacao}
                            disabled={enviando}
                        >
                            {enviando ? 'Enviando…' : 'Confirmar solicitação'}
                        </button>
                    </div>
                </section>
            )}

            <div className="barra-filtro">
                <input
                    type="search"
                    className="campo-busca"
                    placeholder="Buscar alimento, categoria ou cidade…"
                    value={busca}
                    onChange={(evento) => setBusca(evento.target.value)}
                />
                <span className="barra-filtro-total">
                    {filtradas.length}{' '}
                    {filtradas.length === 1
                        ? 'doação encontrada'
                        : 'doações encontradas'}
                </span>
            </div>

            {carregando ? (
                <p className="carregando">Carregando doações…</p>
            ) : filtradas.length === 0 ? (
                <EstadoVazio
                    titulo="Nenhuma doação disponível"
                    descricao="Assim que um estabelecimento publicar um excedente, ele aparecerá aqui."
                />
            ) : (
                <div className="grade-cards">
                    {filtradas.map((doacao) => (
                        <CartaoDoacao
                            key={doacao.id}
                            doacao={doacao}
                            acoes={
                                <button
                                    type="button"
                                    className="botao botao-secundario botao-pequeno"
                                    onClick={() => abrirSolicitacao(doacao)}
                                    disabled={selecionada?.id === doacao.id}
                                >
                                    {selecionada?.id === doacao.id
                                        ? 'Selecionada'
                                        : 'Solicitar doação'}
                                </button>
                            }
                        />
                    ))}
                </div>
            )}
        </Painel>
    );
}
