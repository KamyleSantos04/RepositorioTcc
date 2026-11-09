import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useProtecao(tipoEsperado) {
    const navegar = useNavigate();

    useEffect(() => {
        const tipoSalvo = sessionStorage.getItem('tipoContaConectaAlimento');

        if (!tipoSalvo || tipoSalvo !== tipoEsperado) {
            navegar('/Entrar');
        }
    }, [tipoEsperado, navegar]);
}