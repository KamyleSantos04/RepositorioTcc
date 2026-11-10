import jwt from 'jsonwebtoken';

export function autenticar(req, res, next) {
    const cabecalho = req.headers.authorization;

    if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
        return res.status(401).json({ erro: 'Faça login para continuar.' });
    }

    const token = cabecalho.split(' ')[1];

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch {
        return res
            .status(401)
            .json({ erro: 'Sessão inválida. Entre novamente.' });
    }
}

/**
 * Restringe a rota a um ou mais tipos de conta.
 * Aceita tanto `permitirTipo('ONG')` quanto
 * `permitirTipo('ONG', 'ESTABELECIMENTO')`.
 */
export function permitirTipo(...tipos) {
    const permitidos = tipos.flat();

    return (req, res, next) => {
        if (!req.usuario || !permitidos.includes(req.usuario.tipo)) {
            return res.status(403).json({
                erro: 'Você não tem permissão para acessar esta função.'
            });
        }
        return next();
    };
}
