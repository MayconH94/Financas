import { useEffect, useState } from "react";

export function useLocalStorage<t>(chave: string, valorInicial: t) {
    const [valor, setValor] = useState <t>(() => {
        const salvo = localStorage.getItem(chave);
        return salvo ? (JSON.parse(salvo) as t) : valorInicial;
    });


    useEffect (() => {
        localStorage.setItem(chave, JSON.stringify(valor));
    }, [chave, valor]);


    return [valor, setValor] as const;
}