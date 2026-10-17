import { useEffect, useState } from "react";
import type { Cotacao, Investimento } from "../types/investimento";
import { indexarCotacoes } from "../utils/carteira";

const INTERVALO_MS = 60_000;

function codigosDe(investimentos: Investimento[], tipos: string[]): string {
  const codigos = investimentos
    .filter((i) => tipos.includes(i.tipo) && i.codigo)
    .map((i) => (i.codigo as string).toUpperCase());
  return [...new Set(codigos)].sort().join(",");
}

export function useCotacoes(investimentos: Investimento[]) {
  const [cotacoes, setCotacoes] = useState<Map<string, number>>(new Map());

  // Strings estáveis: só refaz a busca quando a lista de códigos muda.
  const bolsa = codigosDe(investimentos, ["acao", "fii"]);
  const cripto = codigosDe(investimentos, ["cripto"]);

  useEffect(() => {
    if (!bolsa && !cripto) return;
    let ativo = true;

    async function atualizar() {
      try {
        const resposta = await fetch(`/api/cotacoes?bolsa=${bolsa}&cripto=${cripto}`);
        if (!resposta.ok) return;
        const dados = (await resposta.json()) as Cotacao[];
        if (ativo) setCotacoes(indexarCotacoes(dados));
      } catch {
        // sem rede ou sem API (ex.: vite dev): mantém o valor digitado à mão
      }
    }

    void atualizar();
    const timer = setInterval(() => void atualizar(), INTERVALO_MS);
    return () => {
      ativo = false;
      clearInterval(timer);
    };
  }, [bolsa, cripto]);

  return cotacoes;
}
