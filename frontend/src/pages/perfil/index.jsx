import { useEffect, useState } from 'react';
import LayoutDashboard from '../../components/layout-dashboard';
import Aviso from '../../components/aviso';
import { api } from '../../lib/api';
import {
    atualizarNomeDaSessao,
    TIPO_ONG
} from '../../lib/sessao';
import useProtecao from '../../hooks/useProtecao';
import useRequisicao from '../../hooks/useRequisicao';

const TIPOS_ONG = [
    ['ong', 'ONG'],
    ['abrigo', 'Abrigo'],
    ['instituicao-social', 'Instituição social'],
    ['outro', 'Outro']
];

const TIPOS_ESTABELECIMENTO = [
    ['supermercado', 'Supermercado'],
    ['restaurante', 'Restaurante'],
    ['padaria', 'Padaria'],
    ['hortifruti', 'Hortifruti'],
    ['mercado', 'Mercado'],
    ['outro', 'Outro']
];

function paraFormulario(perfil, ehOng) {
    if (!perfil) return null;

    return {
        nome: perfil.nome || '',
        tipo: ehOng
            ? perfil.tipo_instituicao || ''
            : perfil.tipo_estabelecimento || '',
        outroTipo: perfil.outro_tipo || '',
        cnpj: perfil.cnpj || '',
        descricao: perfil.descricao || '',
        responsavel: perfil.responsavel || '',
        telefone: perfil.telefone || '',
        email: perfil.email || '',
        cep: perfil.cep || '',
        estado: perfil.estado || '',
        rua: perfil.rua || '',
        numero: perfil.numero || '',
        complemento: perfil.complemento || '',
        bairro: perfil.bairro || '',
        cidade: perfil.cidade || '',
        pessoasAtendidas: perfil.pessoas_atendidas ?? '',
        frequenciaDoacao: perfil.frequencia_doacao || '',
        alimentosNecessarios: perfil.alimentos_necessarios || '',
        observacoes: perfil.observacoes || '',
        cpfResponsavel: perfil.cpf_responsavel || '',
        cargoResponsavel: perfil.cargo_responsavel || ''
    };
}

function Campo({ id, label, dados, alterar, largo = false, ...props }) {
    const classe = largo ? 'dash-campo dash-campo-largo' : 'dash-campo';
    const Componente = props.as || 'input';
    const { as, children, ...atributos } = props;

    return (
        <div className={classe}>
            <label htmlFor={id}>{label}</label>
            <Componente
                id={id}
                name={id}
                value={dados[id] ?? ''}
                onChange={alterar}
                {...atributos}
            >
                {children}
            </Componente>
        </div>
    );
}

/** Perfil compartilhado: um único formulário para cada tipo de conta. */
export default function Perfil({ tipo }) {
    const ehOng = tipo === TIPO_ONG;
    const sessao = useProtecao(tipo);
    const [dados, setDados] = useState(null);
    const [sucesso, setSucesso] = useState('');
    const [salvando, setSalvando] = useState(false);

    const { dados: perfil, carregando, erro, recarregar, definirErro } =
        useRequisicao(
            () => (ehOng ? api.minhaInstituicao() : api.meuEstabelecimento()),
            [ehOng],
            Boolean(sessao)
        );

    useEffect(() => {
        const formulario = paraFormulario(perfil, ehOng);
        if (formulario) setDados(formulario);
    }, [perfil, ehOng]);

    if (!sessao) return null;

    function alterar(evento) {
        const { name, value } = evento.target;
        setDados((atual) => ({ ...atual, [name]: value }));
    }

    async function salvar(evento) {
        evento.preventDefault();
        if (!dados) return;

        setSalvando(true);
        setSucesso('');
        definirErro('');

        const corpo = ehOng
            ? {
                  nome: dados.nome.trim(),
                  tipoInstituicao: dados.tipo,
                  outroTipo: dados.outroTipo.trim() || null,
                  descricao: dados.descricao.trim(),
                  responsavel: dados.responsavel.trim(),
                  telefone: dados.telefone.trim(),
                  cep: dados.cep.trim(),
                  estado: dados.estado.trim(),
                  rua: dados.rua.trim(),
                  numero: dados.numero.trim(),
                  complemento: dados.complemento.trim() || null,
                  bairro: dados.bairro.trim(),
                  cidade: dados.cidade.trim(),
                  pessoasAtendidas: Number(dados.pessoasAtendidas),
                  frequenciaDoacao: dados.frequenciaDoacao,
                  alimentosNecessarios: dados.alimentosNecessarios.trim(),
                  observacoes: dados.observacoes.trim() || null
              }
            : {
                  nome: dados.nome.trim(),
                  tipoEstabelecimento: dados.tipo,
                  outroTipo: dados.outroTipo.trim() || null,
                  telefone: dados.telefone.trim(),
                  cep: dados.cep.trim(),
                  rua: dados.rua.trim(),
                  numero: dados.numero.trim(),
                  complemento: dados.complemento.trim() || null,
                  bairro: dados.bairro.trim(),
                  cidade: dados.cidade.trim(),
                  estado: dados.estado.trim(),
                  responsavel: dados.responsavel.trim(),
                  cpfResponsavel: dados.cpfResponsavel.trim(),
                  cargoResponsavel: dados.cargoResponsavel.trim()
              };

        try {
            if (ehOng) {
                await api.atualizarInstituicao(corpo);
            } else {
                await api.atualizarEstabelecimento(corpo);
            }

            atualizarNomeDaSessao(corpo.nome);
            setSucesso('Dados atualizados com sucesso!');
            await recarregar();
        } catch (falha) {
            definirErro(falha.message);
        } finally {
            setSalvando(false);
        }
    }

    const tipos = ehOng ? TIPOS_ONG : TIPOS_ESTABELECIMENTO;
    const tipoRotulo = ehOng ? 'Tipo de instituição *' : 'Tipo de estabelecimento *';

    return (
        <LayoutDashboard tipo={tipo}>
            <header className="dash-cabecalho">
                <div>
                    <h1>Perfil</h1>
                    <p>
                        Consulte e mantenha atualizadas as informações do seu
                        cadastro.
                    </p>
                </div>
            </header>

            <Aviso tipo="erro">{erro}</Aviso>
            <Aviso tipo="sucesso">{sucesso}</Aviso>

            {carregando || !dados ? (
                <p className="dash-carregando">Carregando dados do perfil…</p>
            ) : (
                <section className="dash-painel">
                    <form className="dash-form" onSubmit={salvar}>
                        <div className="dash-form-grade">
                            <Campo
                                id="nome"
                                label={ehOng ? 'Nome da instituição *' : 'Nome do estabelecimento *'}
                                dados={dados}
                                alterar={alterar}
                                required
                            />
                            <Campo
                                id="tipo"
                                label={tipoRotulo}
                                dados={dados}
                                alterar={alterar}
                                as="select"
                                required
                            >
                                <option value="" disabled>Selecione</option>
                                {tipos.map(([valor, rotulo]) => (
                                    <option key={valor} value={valor}>{rotulo}</option>
                                ))}
                            </Campo>

                            {dados.tipo === 'outro' && (
                                <Campo
                                    id="outroTipo"
                                    label="Qual tipo? *"
                                    dados={dados}
                                    alterar={alterar}
                                    required
                                />
                            )}

                            <Campo
                                id="cnpj"
                                label="CNPJ"
                                dados={dados}
                                alterar={alterar}
                                readOnly
                            />
                            <Campo
                                id="email"
                                label="E-mail"
                                dados={dados}
                                alterar={alterar}
                                type="email"
                                readOnly
                            />
                            <Campo id="telefone" label="Telefone *" dados={dados} alterar={alterar} required />

                            {ehOng && (
                                <Campo
                                    id="descricao"
                                    label="Descrição *"
                                    dados={dados}
                                    alterar={alterar}
                                    as="textarea"
                                    largo
                                    required
                                />
                            )}

                            <Campo id="responsavel" label="Responsável *" dados={dados} alterar={alterar} required />

                            {!ehOng && (
                                <>
                                    <Campo id="cpfResponsavel" label="CPF do responsável *" dados={dados} alterar={alterar} required />
                                    <Campo id="cargoResponsavel" label="Cargo do responsável *" dados={dados} alterar={alterar} required />
                                </>
                            )}

                            <Campo id="cep" label="CEP *" dados={dados} alterar={alterar} required />
                            <Campo id="estado" label="Estado *" dados={dados} alterar={alterar} required />
                            <Campo id="rua" label="Rua *" dados={dados} alterar={alterar} required />
                            <Campo id="numero" label="Número *" dados={dados} alterar={alterar} required />
                            <Campo id="complemento" label="Complemento" dados={dados} alterar={alterar} />
                            <Campo id="bairro" label="Bairro *" dados={dados} alterar={alterar} required />
                            <Campo id="cidade" label="Cidade *" dados={dados} alterar={alterar} required />

                            {ehOng && (
                                <>
                                    <Campo
                                        id="pessoasAtendidas"
                                        label="Pessoas atendidas *"
                                        dados={dados}
                                        alterar={alterar}
                                        type="number"
                                        min="0"
                                        required
                                    />
                                    <Campo
                                        id="frequenciaDoacao"
                                        label="Frequência de doação *"
                                        dados={dados}
                                        alterar={alterar}
                                        as="select"
                                        required
                                    >
                                        <option value="" disabled>Selecione</option>
                                        <option value="semanal">Semanal</option>
                                        <option value="quinzenal">Quinzenal</option>
                                        <option value="mensal">Mensal</option>
                                        <option value="conforme-necessidade">Conforme a necessidade</option>
                                    </Campo>
                                    <Campo
                                        id="alimentosNecessarios"
                                        label="Alimentos necessários *"
                                        dados={dados}
                                        alterar={alterar}
                                        as="textarea"
                                        largo
                                        required
                                    />
                                    <Campo
                                        id="observacoes"
                                        label="Observações"
                                        dados={dados}
                                        alterar={alterar}
                                        as="textarea"
                                        largo
                                    />
                                </>
                            )}
                        </div>

                        <div className="dash-acoes">
                            <button className="dash-botao" type="submit" disabled={salvando}>
                                {salvando ? 'Salvando…' : 'Salvar alterações'}
                            </button>
                        </div>
                    </form>
                </section>
            )}
        </LayoutDashboard>
    );
}
