export default function Aviso({ tipo, children }) {
    if (!children) {
        return null;
    }

    return (
        <div className={`aviso aviso-${tipo}`} role="status">
            {children}
        </div>
    );
}