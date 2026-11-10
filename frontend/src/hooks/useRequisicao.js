import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Executa uma chamada à API e devolve estado de carregamento, dados e erro.
 *
 * @param {Function} buscar função assíncrona que devolve os dados
 * @param {Array} dependencias dependências do useEffect
 */
export default function useRequisicao(buscar, dependencias = [], ativo = true) {
    const [dados, setDados] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const montado = useRef(true);
    const buscarRef = useRef(buscar);
    buscarRef.current = buscar;

    useEffect(() => {
        montado.current = true;
        return () => {
            montado.current = false;
        };
    }, []);

    const recarregar = useCallback(async () => {
        setCarregando(true);
        setErro('');

        try {
            const resultado = await buscarRef.current();
            if (montado.current) setDados(resultado);
        } catch (falha) {
            if (montado.current) setErro(falha.message);
        } finally {
            if (montado.current) setCarregando(false);
        }
    }, []);

    useEffect(() => {
        if (!ativo) {
            setCarregando(false);
            return undefined;
        }

        recarregar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencias, ativo]);

    return { dados, carregando, erro, recarregar, definirErro: setErro };
}
