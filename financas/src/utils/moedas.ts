// Ordem em que as moedas aparecem nas listas
export const ORDEM_MOEDAS = ["BRL", "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF"];

export const NOMES_MOEDAS: Record<string, string> = {
  BRL: "Real brasileiro",
  USD: "Dólar americano",
  EUR: "Euro",
  GBP: "Libra esterlina",
  JPY: "Iene japonês",
  CAD: "Dólar canadense",
  AUD: "Dólar australiano",
  CHF: "Franco suíço",
};

// "1.500,50" -> 1500.5 (null se não for um número válido)
export function lerNumero(texto: string): number | null {
  const limpo = texto.trim().replace(/\./g, "").replace(",", ".");
  if (limpo === "") return null;
  const numero = Number(limpo);
  return Number.isFinite(numero) && numero >= 0 ? numero : null;
}

// taxas = unidades de cada moeda para 1 BRL
export function converter(valor: number, de: string, para: string, taxas: Record<string, number>): number {
  return (valor / taxas[de]) * taxas[para];
}

export function formatarValor(valor: number, moeda: string): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: moeda }).format(valor);
}
