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


// Maior valor aceito em um campo de dinheiro: R$ 999.999.999,99.
const MAX_CENTAVOS = 99_999_999_999;

// Converte o texto digitado para centavos. Devolve NaN se for inválido.
// Aceita "1.234,56", "1234,56" e "38.95" (ponto único com 1-2 dígitos
// depois = decimal). "1.000" e "1.234.567" são milhares. Letras e
// notação científica (1e3) são rejeitadas.
export function converterParaCentavos(texto: string): number {
  const t = texto.trim();
  if (!/^[\d.,]+$/.test(t)) return NaN;

  let normalizado: string;
  if (t.includes(",")) {
    if (t.split(",").length > 2) return NaN;
    normalizado = t.replace(/\./g, "").replace(",", ".");
  } else {
    const partes = t.split(".");
    const ehDecimal = partes.length === 2 && partes[1].length > 0 && partes[1].length < 3;
    normalizado = ehDecimal ? t : t.replace(/\./g, "");
  }

  const numero = Number(normalizado);
  if (!normalizado || Number.isNaN(numero)) return NaN;
  const centavos = Math.round(numero * 100);
  return centavos > MAX_CENTAVOS ? NaN : centavos;
}
