import { useState } from 'react';
import { Link } from 'react-router-dom';
import LayoutDashboard from '../../components/layout-dashboard';
import Aviso from '../../components/aviso';
import { api } from '../../lib/api';
import { TIPO_ESTABELECIMENTO } from '../../lib/sessao';
import useProtecao from '../../hooks/useProtecao';
import './index.scss';
import '../../components/aviso/index.scss';

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
    const sessao = useProtecao(TIPO_ESTABELECIMENTO);

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

    if (!sessao) return null;

    return (
        <LayoutDashboard tipo={TIPO_ESTABELECIMENTO}>
            <Link to="/DashEstabelecimento" className="cadastro-alimento-voltar">
                ← Voltar ao painel
            </Link>
            <header className="dash-cabecalho cadastro-alimento-cabecalho">
                <div>
                    <span className="cadastro-alimento-sobrancelha">Nova publicação</span>
                    <h1>Cadastrar alimento</h1>
                    <p>Informe o excedente disponível. Assim que publicar, as instituições poderão encontrá-lo em tempo real.</p>
                </div>
                <Link to="/MinhasDoacoes" className="dash-botao dash-botao-claro">
                    Minhas doações
                </Link>
            </header>

            <Aviso tipo="erro">{erro}</Aviso>
            <Aviso tipo="sucesso">{sucesso}</Aviso>

            <section className="cadastro-alimento-grade">
                <div className="dash-painel cadastro-alimento-formulario">
                    <form className="dash-form" onSubmit={publicar}>
                        <div className="dash-form-grade">
                            <div className="dash-campo dash-campo-largo">
                                <label htmlFor="nomeAlimento">Descrição do alimento *</label>
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

                            <div className="dash-campo">
                                <label htmlFor="categoria">Tipo de alimento</label>
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

                            <div className="dash-campo">
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

                            <div className="dash-campo">
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

                            <div className="dash-campo">
                                <label htmlFor="validade">Validade</label>
                                <input
                                    id="validade"
                                    name="validade"
                                    type="date"
                                    value={dados.validade}
                                    onChange={alterar}
                                />
                            </div>

                            <div className="dash-campo">
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
                                <span className="dash-ajuda">
                                    Data e horário limite para a instituição buscar.
                                </span>
                            </div>

                            <div className="dash-campo dash-campo-largo">
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

                            <div className="dash-campo dash-campo-largo">
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

                        <div className="dash-acoes">
                            <button
                                type="submit"
                                className="dash-botao"
                                disabled={enviando}
                            >
                                {enviando ? 'Publicando…' : 'Publicar doação'}
                            </button>

                            <button
                                type="button"
                                className="dash-botao dash-botao-secundario"
                                onClick={limpar}
                                disabled={enviando}
                            >
                                Limpar
                            </button>

                            <Link to="/MinhasDoacoes" className="dash-botao dash-botao-claro">
                                Ver minhas doações
                            </Link>
                        </div>
                    </form>
                </div>

                <aside className="dash-painel cadastro-alimento-dica">
                    <div className="cadastro-alimento-dica-topo">
                        <span aria-hidden="true">!</span>
                        <div>
                            <p className="cadastro-alimento-sobrancelha">Dica</p>
                            <h2>Publique com clareza</h2>
                        </div>
                    </div>

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
                    <img
                        className="cadastro-alimento-ilustracao"
                        src="/assets/images/maca.png"
                        alt=""
                    />
                </aside>
            </section>
        </LayoutDashboard>
    );
}
