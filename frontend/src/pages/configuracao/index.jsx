import Perfil from '../perfil';
import { TIPO_ESTABELECIMENTO } from '../../lib/sessao';

/** A configuração de conta agora é centralizada no Perfil. */
export default function Configuracao() {
    return <Perfil tipo={TIPO_ESTABELECIMENTO} />;
}
