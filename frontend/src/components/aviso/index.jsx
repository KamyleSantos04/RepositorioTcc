import './index.scss';

export default function Aviso({ tipo = 'erro', children }) {
    if (!children) {
        return null;
    }

    return (
        <div className={`aviso aviso-${tipo}`} role="status">
            {children}
        </div>
    );
}
