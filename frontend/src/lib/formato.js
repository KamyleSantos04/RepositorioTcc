const MOEDA = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
});

export function formatarQuantidade(quantidade, unidade) {
    if (quantidade === null || quantidade === undefined || quantidade === '') {
        return `—${unidade ? ` ${unidade}` : ''}`;
    }

    const numero = Number(quantidade);
    const texto = Number.isFinite(numero) ? MOEDA.format(numero) : String(quantidade);

    return unidade ? `${texto} ${unidade}` : texto;
}

export function formatarData(valor) {
    if (!valor) return '—';

    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '—';

    return data.toLocaleDateString('pt-BR');
}

export function formatarDataHora(valor) {
    if (!valor) return '—';

    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '—';

    return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString(
        'pt-BR',
        { hour: '2-digit', minute: '2-digit' }
    )}`;
}

export function formatarHorario(valor) {
    if (!valor) return '—';

    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '—';

    return data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

const ROTULOS_STATUS = {
    DISPONIVEL: 'Disponível',
    RESERVADA: 'Reservada',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada',
    PENDENTE: 'Pendente',
    ACEITA: 'Aceita',
    RECUSADA: 'Recusada'
};

export function rotuloStatus(status) {
    return ROTULOS_STATUS[status] || status || '—';
}

export function classeStatus(status) {
    return `status status-${String(status || '').toLowerCase()}`;
}

export function dataParaInput(valor) {
    if (!valor) return '';
    return String(valor).slice(0, 10);
}

export function dataHoraParaInput(valor) {
    if (!valor) return '';
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '';

    const pad = (n) => String(n).padStart(2, '0');
    return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(
        data.getDate()
    )}T${pad(data.getHours())}:${pad(data.getMinutes())}`;
}
