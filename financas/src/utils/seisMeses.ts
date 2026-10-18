import type { Transacao } from "../types/transacao";

export type MesResumo = {
  chave: string; // "2026-10"
  rotulo: string; // "out"
  receitas: number; // em centavos
  despesas: number; // em centavos
};

const NOMES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// mesFinal vem do filtro de mês, no formato "2026-10"
export function resumoUltimosMeses(
  transacoes: Transacao[],
  mesFinal: string,
  quantidade = 6,
): MesResumo[] {
  const [ano, mes] = mesFinal.split("-").map(Number);

  const meses: MesResumo[] = [];
  for (let i = quantidade - 1; i >= 0; i--) {
    const d = new Date(ano, mes - 1 - i, 1);
    const m = d.getMonth();
    meses.push({
      chave: `${d.getFullYear()}-${String(m + 1).padStart(2, "0")}`,
      rotulo: NOMES[m],
      receitas: 0,
      despesas: 0,
    });
  }

  for (const t of transacoes) {
    const alvo = meses.find((x) => x.chave === t.data.slice(0, 7));
    if (!alvo) continue;
    if (t.tipo === "receita") alvo.receitas += t.valorEmCentavos;
    else alvo.despesas += t.valorEmCentavos;
  }

  return meses;
}