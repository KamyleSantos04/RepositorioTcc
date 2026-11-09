import './index.scss';
import './index.scss';

export default function Painel({ titulo, subtitulo, acoes, children }) {
    return (
        <main className="painel">
            <header className="painel-cabecalho">
                <div>
                    <h1>{titulo}</h1>
                    <p>{subtitulo}</p>
                </div>

                <div>{acoes}</div>
            </header>

            {children}
        </main>
    );
}