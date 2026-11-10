import Perfil from '../perfil';
import { TIPO_ESTABELECIMENTO } from '../../lib/sessao';

/** Compatibilidade com a rota antiga do dashboard do estabelecimento. */
export default function MeusEstabelecimentos() {
    return <Perfil tipo={TIPO_ESTABELECIMENTO} />;
}
