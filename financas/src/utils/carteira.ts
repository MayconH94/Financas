import type { Cotacao, Investimento } from "../types/investimento";

export type Posicao = {
  atualEmCentavos: number | null;
  resultadoEmCentavos: number | null;
  percentual: number | null;
};

// Com cotação ao vivo, valor atual = preço x quantidade.
// Sem cotação, cai no valor atual digitado à mão (ou null).
export function calcularPosicao(i: Investimento, cotacoes: Map<string, number>): Posicao {
  const preco = i.codigo ? cotacoes.get(i.codigo.toUpperCase()) : undefined;
  const atual = preco !== undefined ? Math.round(preco * i.quantidade) : i.valorAtualEmCentavos;

  if (atual === null) return { atualEmCentavos: null, resultadoEmCentavos: null, percentual: null };

  const resultado = atual - i.valorInvestidoEmCentavos;
  const percentual = i.valorInvestidoEmCentavos > 0 ? (resultado / i.valorInvestidoEmCentavos) * 100 : null;
  return { atualEmCentavos: atual, resultadoEmCentavos: resultado, percentual };
}

export function indexarCotacoes(cotacoes: Cotacao[]): Map<string, number> {
  return new Map(cotacoes.map((c) => [c.codigo.toUpperCase(), c.precoEmCentavos]));
}
