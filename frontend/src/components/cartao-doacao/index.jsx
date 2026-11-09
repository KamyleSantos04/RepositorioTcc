import EtiquetaStatus from '../etiqueta-status';
import { formatarData, formatarQuantidade, formatarHorario } from '../../lib/formato';
import './index.scss';

export default function CartaoDoacao({ doacao, acoes, mostrarEndereco = false }) {
    return (
        <article className="cartao cartao-doacao">
            <div className="cartao-doacao-topo">
                <div>
                    {doacao.categoria && (
                        <span className="selo-categoria">{doacao.categoria}</span>
                    )}
                    <h2>{doacao.nome_alimento}</h2>
                </div>

                <EtiquetaStatus status={doacao.status} />
            </div>

            <ul className="meta cartao-doacao-meta">
                <li>
                    <strong>Quantidade:</strong>{' '}
                    {formatarQuantidade(doacao.quantidade, doacao.unidade)}
                </li>

                {doacao.estabelecimento && (
                    <li>
                        <strong>Doador:</strong> {doacao.estabelecimento}
                    </li>
                )}

                {doacao.cidade && (
                    <li>
                        <strong>Local:</strong>{' '}
                        {[doacao.cidade, doacao.estado].filter(Boolean).join(' - ')}
                    </li>
                )}

                {doacao.validade && (
                    <li>
                        <strong>Validade:</strong> {formatarData(doacao.validade)}
                    </li>
                )}

                {doacao.retirada_ate && (
                    <li>
                        <strong>Retirada até:</strong>{' '}
                        {formatarHorario(doacao.retirada_ate)}
                    </li>
                )}

                {mostrarEndereco && doacao.endereco_retirada && (
                    <li>
                        <strong>Endereço:</strong> {doacao.endereco_retirada}
                    </li>
                )}
            </ul>

            {doacao.observacoes && (
                <p className="cartao-doacao-observacao">{doacao.observacoes}</p>
            )}

            {acoes && <div className="rodape-cartao">{acoes}</div>}
        </article>
    );
}
