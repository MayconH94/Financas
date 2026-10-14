import type { Transacao } from "../types/transacao";

// 1990 -> "R$ 19,90". O Intl cuida do ponto, da vírgula e do símbolo.
export function formatarMoeda(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Converte o que o usuário digita (19.9) para centavos (1990).
// Math.round evita resíduos como 19.899999.
export function reaisParaCentavos(reais: number): number {
  return Math.round(reais * 100);
}

// reduce percorre a lista acumulando um total, começando em 0.
// Receita soma, despesa subtrai.
export function calcularSaldo(transacoes: Transacao[]): number {
  return transacoes.reduce(
    (total, t) =>
      t.tipo === "receita"
        ? total + t.valorEmCentavos
        : total - t.valorEmCentavos,
    0
  );
}


export function converterParaCentavos(texto: string): number {
  const normalizado = texto
  .trim()
  .replace(/\./g, "") // remove separador de milhar
  .replace(",", ".") // virugla decima vira ponto

 const numero = Number(normalizado);
 if (!normalizado || Number.isNaN(numero)) return NaN;
 return Math.round(numero * 100); 

}

