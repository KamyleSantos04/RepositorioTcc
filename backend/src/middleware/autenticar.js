import jwt from 'jsonwebtoken';

export function autenticar(req, res, next) {
    const cabecalho = req.headers.authorization;

    if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
        return res.status(401).json({ erro: 'Faça login para continuar.' });
    }

    const token = cabecalho.split(' ')[1];

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (erro) {
        return res.status(401).json({ erro: 'Sessão inválida. Entre novamente.' });
    }
}

export function permitirTipo(tipo) {
    return (req, res, next) => {
        if (req.usuario?.tipo !== tipo) {
            return res.status(403).json({ erro: 'Você não tem permissão para acessar esta função.' });
        }
        next();
    };
}
