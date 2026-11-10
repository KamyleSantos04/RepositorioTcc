import EtiquetaStatus from '../etiqueta-status';
import {
    formatarDataHora,
    formatarHorario
} from '../../lib/formato';
import './index.scss';

/**
 * Cartão de uma solicitação/recebimento.
 *
 * @param {object} solicitacao registro vindo de /api/minhas-solicitacoes
 *                             ou /api/solicitacoes-recebidas
 * @param {React.ReactNode} acoes botões do rodapé
 * @param {boolean} mostrarContato exibe telefone do doador
 */
export default function CartaoSolicitacao({
    solicitacao,
    acoes,
    mostrarContato = false
}) {
    return (
        <article className="dash-painel cartao-solicitacao">
            <div className="cartao-solicitacao-topo">
                <div>
                    <h2>{solicitacao.nome_alimento}</h2>
                    <p className="cartao-solicitacao-sub">
                        {solicitacao.quantidade} {solicitacao.unidade}
                        {solicitacao.estabelecimento
                            ? ` · ${solicitacao.estabelecimento}`
                            : ''}
                        {solicitacao.instituicao
                            ? ` · ${solicitacao.instituicao}`
                            : ''}
                    </p>
                </div>

                <EtiquetaStatus status={solicitacao.status} />
            </div>

            <ul className="meta">
                {(solicitacao.cidade || solicitacao.estado) && (
                    <li>
                        <strong>Local:</strong>{' '}
                        {[solicitacao.cidade, solicitacao.estado]
                            .filter(Boolean)
                            .join(' - ')}
                    </li>
                )}

                {solicitacao.endereco_retirada && (
                    <li>
                        <strong>Retirada:</strong>{' '}
                        {solicitacao.endereco_retirada}
                    </li>
                )}

                {solicitacao.retirada_ate && (
                    <li>
                        <strong>Até:</strong>{' '}
                        {formatarHorario(solicitacao.retirada_ate)}
                    </li>
                )}

                {mostrarContato && solicitacao.telefone && (
                    <li>
                        <strong>Contato:</strong> {solicitacao.telefone}
                    </li>
                )}

                {solicitacao.pessoas_atendidas ? (
                    <li>
                        <strong>Pessoas atendidas:</strong>{' '}
                        {solicitacao.pessoas_atendidas}
                    </li>
                ) : null}

                <li>
                    <strong>Solicitado em:</strong>{' '}
                    {formatarDataHora(solicitacao.criado_em)}
                </li>
            </ul>

            {solicitacao.mensagem && (
                <p className="cartao-solicitacao-mensagem">
                    “{solicitacao.mensagem}”
                </p>
            )}

            {acoes && <div className="dash-acoes">{acoes}</div>}
        </article>
    );
}
