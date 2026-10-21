import type { Transacao } from "../types/transacao";
import type { Categoria } from "./categorias";

export type GastoCategoria = { categoria: Categoria; totalEmCentavos: number; percentual: number };

// despesas do mês (formato "2026-10")
export function despesasDoMes(transacoes: Transacao[], mes: string): Transacao[] {
  return transacoes.filter((t) => t.tipo === "despesa" && t.data.startsWith(mes));
}

export function totalDespesas(despesas: Transacao[]): number {
  return despesas.reduce((soma, t) => soma + t.valorEmCentavos, 0);
}

// categorias ordenadas do maior para o menor gasto
export function gastosPorCategoria(despesas: Transacao[]): GastoCategoria[] {
  const total = totalDespesas(despesas);
  const mapa = new Map<Categoria, number>();
  for (const t of despesas) mapa.set(t.categoria, (mapa.get(t.categoria) ?? 0) + t.valorEmCentavos);

  return [...mapa.entries()]
    .map(([categoria, totalEmCentavos]) => ({
      categoria,
      totalEmCentavos,
      percentual: total > 0 ? (totalEmCentavos / total) * 100 : 0,
    }))
    .sort((a, b) => b.totalEmCentavos - a.totalEmCentavos);
}

export function maioresDespesas(despesas: Transacao[], quantidade = 5): Transacao[] {
  return [...despesas].sort((a, b) => b.valorEmCentavos - a.valorEmCentavos).slice(0, quantidade);
}

export type SituacaoMeta = "ok" | "atencao" | "estourou";

// até 79% ok, de 80% a 100% atenção, acima de 100% estourou
export function situacaoMeta(gasto: number, limite: number): SituacaoMeta {
  if (gasto > limite) return "estourou";
  if (gasto >= limite * 0.8) return "atencao";
  return "ok";
}
