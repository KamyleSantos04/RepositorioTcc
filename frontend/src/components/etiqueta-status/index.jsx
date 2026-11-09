import { classeStatus, rotuloStatus } from '../../lib/formato';

export default function EtiquetaStatus({ status }) {
    return (
        <span className={classeStatus(status)}>
            {rotuloStatus(status)}
        </span>
    );
}
