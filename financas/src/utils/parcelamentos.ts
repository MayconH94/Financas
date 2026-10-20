import type { Categoria } from "./categorias";
import type { Transacao } from "../types/transacao";

export type Parcelamento = {
  id: string;
  descricao: string;
  valorTotalEmCentavos: number;
  parcelas: number; // quantidade de parcelas
  primeiraParcela: string; // AAAA-MM-DD, vencimento da 1ª parcela
  categoria: Categoria;
};

export type NovoParcelamento = Omit<Parcelamento, "id">;

const pad = (n: number) => String(n).padStart(2, "0");
export const hojeISO = () => new Date().toLocaleDateString("sv-SE"); // AAAA-MM-DD no fuso local

// vencimento da parcela de índice i (0 = primeira). Dia 31 vira o último dia de meses curtos.
export function dataDaParcela(p: Parcelamento, i: number): string {
  const [ano0, mes0, dia] = p.primeiraParcela.split("-").map(Number);
  const meses = ano0 * 12 + (mes0 - 1) + i;
  const ano = Math.floor(meses / 12);
  const mes = (meses % 12) + 1;
  const ultimoDia = new Date(ano, mes, 0).getDate();
  return `${ano}-${pad(mes)}-${pad(Math.min(dia, ultimoDia))}`;
}

// valor da parcela i; a última absorve os centavos que sobram da divisão
export function valorDaParcela(p: Parcelamento, i: number): number {
  const base = Math.floor(p.valorTotalEmCentavos / p.parcelas);
  const resto = p.valorTotalEmCentavos - base * p.parcelas;
  return i === p.parcelas - 1 ? base + resto : base;
}

export type ResumoParcelamento = {
  pagas: number;
  restantes: number;
  valorPago: number;
  valorRestante: number;
  quitado: boolean;
  proxima: { numero: number; data: string; valor: number } | null;
};

// uma parcela conta como paga quando o vencimento chega (data <= hoje)
export function resumir(p: Parcelamento, hoje: string = hojeISO()): ResumoParcelamento {
  let pagas = 0;
  let valorPago = 0;
  for (let i = 0; i < p.parcelas; i++) {
    if (dataDaParcela(p, i) <= hoje) {
      pagas++;
      valorPago += valorDaParcela(p, i);
    }
  }
  const quitado = pagas >= p.parcelas;
  return {
    pagas,
    restantes: p.parcelas - pagas,
    valorPago,
    valorRestante: p.valorTotalEmCentavos - valorPago,
    quitado,
    proxima: quitado
      ? null
      : { numero: pagas + 1, data: dataDaParcela(p, pagas), valor: valorDaParcela(p, pagas) },
  };
}

// total das parcelas que vencem no mês (AAAA-MM)
export function parcelasDoMes(lista: Parcelamento[], mes: string): number {
  let total = 0;
  for (const p of lista) {
    for (let i = 0; i < p.parcelas; i++) {
      if (dataDaParcela(p, i).startsWith(mes)) total += valorDaParcela(p, i);
    }
  }
  return total;
}

// cada parcela vira uma despesa "virtual", para entrar nos totais e gráficos do mês
export function parcelasComoTransacoes(lista: Parcelamento[]): Transacao[] {
  const saida: Transacao[] = [];
  for (const p of lista) {
    for (let i = 0; i < p.parcelas; i++) {
      saida.push({
        id: `parc-${p.id}-${i}`,
        descricao: `${p.descricao} (${i + 1}/${p.parcelas})`,
        valorEmCentavos: valorDaParcela(p, i),
        data: dataDaParcela(p, i),
        categoria: p.categoria,
        tipo: "despesa",
      });
    }
  }
  return saida;
}
