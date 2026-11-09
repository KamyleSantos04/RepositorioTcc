import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Painel from '../../components/painel';
import Aviso from '../../components/aviso';
import { api } from '../../lib/api';
import { TIPO_ESTABELECIMENTO } from '../../lib/sessao';
import useProtecao from '../../hooks/useProtecao';
import './index.scss';

const CATEGORIAS = [
    'Frutas',
    'Verduras e legumes',
    'Grãos e cereais',
    'Laticínios',
    'Carnes',
    'Pães e padaria',
    'Alimentos preparados',
    'Bebidas',
    'Outros'
];

const UNIDADES = [
    'Unidades',
    'Kg',
    'Gramas',
    'Litros',
    'Pacotes',
    'Caixas',
    'Cestas'
];

const FORMULARIO_INICIAL = {
    nomeAlimento: '',
    categoria: '',
    quantidade: '',
    unidade: '',
    validade: '',
    retiradaAte: '',
    enderecoRetirada: '',
    observacoes: ''
};

export default function CadastrarAlimento() {
    useProtecao(TIPO_ESTABELECIMENTO);

    const navegar = useNavigate();
    const [dados, setDados] = useState(FORMULARIO_INICIAL);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [enviando, setEnviando] = useState(false);

    function alterar(event) {
        const { name, value } = event.target;
        setDados((atual) => ({ ...atual, [name]: value }));
    }

    function limpar() {
        setDados(FORMULARIO_INICIAL);
        setErro('');
        setSucesso('');
    }

    async function publicar(event) {
        event.preventDefault();
        setErro('');
        setSucesso('');
        setEnviando(true);

        try {
            await api.criarDoacao({
                nomeAlimento: dados.nomeAlimento.trim(),
                categoria: dados.categoria || null,
                quantidade: Number(dados.quantidade),
                unidade: dados.unidade,
                validade: dados.validade || null,
                retiradaAte: dados.retiradaAte
                    ? dados.retiradaAte.replace('T', ' ')
                    : null,
                enderecoRetirada: dados.enderecoRetirada.trim(),
                observacoes: dados.observacoes.trim() || null
            });

            setDados(FORMULARIO_INICIAL);
            setSucesso('Doação publicada! Ela já está visível para as instituições.');
        } catch (falha) {
            setErro(falha.message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <Painel
            titulo="Cadastrar alimento"
            subtitulo="Publique o excedente do seu estabelecimento e conecte-o a uma instituição que precisa."
            acoes={
                <Link to="/MinhasDoacoes" className="botao botao-claro">
                    Minhas doações
                </Link>
            }
        >
            <Aviso tipo="erro">{erro}</Aviso>
            <Aviso tipo="sucesso">{sucesso}</Aviso>

            <section className="grade-duas">
                <div className="cartao">
                    <form className="formulario" onSubmit={publicar} noValidate={false}>
                        <div className="formulario-grade">
                            <div className="campo campo-largo">
                                <label htmlFor="nomeAlimento">Alimento *</label>
                                <input
                                    id="nomeAlimento"
                                    name="nomeAlimento"
                                    type="text"
                                    placeholder="Ex.: 30 pães franceses"
                                    value={dados.nomeAlimento}
                                    onChange={alterar}
                                    maxLength={150}
                                    required
                                />
                            </div>

                            <div className="campo">
                                <label htmlFor="categoria">Categoria</label>
                                <select
                                    id="categoria"
                                    name="categoria"
                                    value={dados.categoria}
                                    onChange={alterar}
                                >
                                    <option value="">Selecione</option>
                                    {CATEGORIAS.map((categoria) => (
                                        <option key={categoria} value={categoria}>
                                            {categoria}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="campo">
                                <label htmlFor="unidade">Unidade *</label>
                                <select
                                    id="unidade"
                                    name="unidade"
                                    value={dados.unidade}
                                    onChange={alterar}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    {UNIDADES.map((unidade) => (
                                        <option key={unidade} value={unidade}>
                                            {unidade}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="campo">
                                <label htmlFor="quantidade">Quantidade *</label>
                                <input
                                    id="quantidade"
                                    name="quantidade"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="Ex.: 30"
                                    value={dados.quantidade}
                                    onChange={alterar}
                                    required
                                />
                            </div>

                            <div className="campo">
                                <label htmlFor="validade">Validade</label>
                                <input
                                    id="validade"
                                    name="validade"
                                    type="date"
                                    value={dados.validade}
                                    onChange={alterar}
                                />
                            </div>

                            <div className="campo">
                                <label htmlFor="retiradaAte">
                                    Retirada até
                                </label>
                                <input
                                    id="retiradaAte"
                                    name="retiradaAte"
                                    type="datetime-local"
                                    value={dados.retiradaAte}
                                    onChange={alterar}
                                />
                                <span className="campo-ajuda">
                                    Data e horário limite para a instituição buscar.
                                </span>
                            </div>

                            <div className="campo campo-largo">
                                <label htmlFor="enderecoRetirada">
                                    Local de retirada *
                                </label>
                                <input
                                    id="enderecoRetirada"
                                    name="enderecoRetirada"
                                    type="text"
                                    placeholder="Endereço completo com ponto de referência"
                                    value={dados.enderecoRetirada}
                                    onChange={alterar}
                                    maxLength={300}
                                    required
                                />
                            </div>

                            <div className="campo campo-largo">
                                <label htmlFor="observacoes">Observações</label>
                                <textarea
                                    id="observacoes"
                                    name="observacoes"
                                    placeholder="Ex.: produto aberto, manter refrigerado, retirar pelos fundos…"
                                    value={dados.observacoes}
                                    onChange={alterar}
                                />
                            </div>
                        </div>

                        <div className="acoes-formulario">
                            <button
                                type="submit"
                                className="botao botao-principal"
                                disabled={enviando}
                            >
                                {enviando ? 'Publicando…' : 'Publicar doação'}
                            </button>

                            <button
                                type="button"
                                className="botao botao-secundario"
                                onClick={limpar}
                                disabled={enviando}
                            >
                                Limpar
                            </button>

                            <button
                                type="button"
                                className="botao botao-claro"
                                onClick={() => navegar('/MinhasDoacoes')}
                            >
                                Ver minhas doações
                            </button>
                        </div>
                    </form>
                </div>

                <aside className="cartao cadastro-alimento-dica">
                    <h2>Antes de publicar</h2>

                    <ul className="cadastro-alimento-lista">
                        <li>
                            Descreva o alimento com clareza: tipo, quantidade e estado
                            de conservação.
                        </li>
                        <li>
                            Informe um horário de retirada realista para facilitar o
                            transporte pela instituição.
                        </li>
                        <li>
                            Quanto mais completa a descrição, maior a chance de a
                            doação ser solicitada rapidamente.
                        </li>
                        <li>
                            Alimentos perecíveis devem ser publicados no mesmo dia da
                            produção.
                        </li>
                    </ul>

                    <div className="cadastro-alimento-rodape">
                        <p>
                            Precisa ajustar algo já publicado? Use a página{' '}
                            <Link to="/MinhasDoacoes">Minhas doações</Link> para
                            alterar o status ou remover o registro.
                        </p>
                    </div>
                </aside>
            </section>
        </Painel>
    );
}
