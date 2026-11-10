export default function EstadoVazio({ titulo, descricao, acao }) {
    return (
        <div className="dash-vazio">
            <h2>{titulo}</h2>
            {descricao && <p>{descricao}</p>}
            {acao}
        </div>
    );
}
