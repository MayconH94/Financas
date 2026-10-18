import type { Categoria, Transacao } from "../types/transacao";

const NOMES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export type ConsumoCategoria = { categoria: Categoria; total: number }; // total em centavos
export type ConsumoSeisMeses = { itens: ConsumoCategoria[]; total: number; periodo: string };

// "2026-05" -> "mai/26"
function rotulo(chave: string) {
  return `${NOMES[Number(chave.slice(5, 7)) - 1]}/${chave.slice(2, 4)}`;
}

// mesFinal vem do filtro de mês, no formato "2026-10"
export function consumoUltimosMeses(
  transacoes: Transacao[],
  mesFinal: string,
  quantidade = 6,
): ConsumoSeisMeses {
  const [ano, mes] = mesFinal.split("-").map(Number);

  const chaves: string[] = [];
  for (let i = quantidade - 1; i >= 0; i--) {
    const d = new Date(ano, mes - 1 - i, 1);
    chaves.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const soma = new Map<Categoria, number>();
  for (const t of transacoes) {
    if (t.tipo !== "despesa" || !chaves.includes(t.data.slice(0, 7))) continue;
    soma.set(t.categoria, (soma.get(t.categoria) ?? 0) + t.valorEmCentavos);
  }

  const itens = Array.from(soma, ([categoria, total]) => ({ categoria, total })).sort(
    (a, b) => b.total - a.total,
  );
  const total = itens.reduce((s, i) => s + i.total, 0);

  return {
    itens,
    total,
    periodo: `${rotulo(chaves[0])} a ${rotulo(chaves[chaves.length - 1])}`,
  };
}
