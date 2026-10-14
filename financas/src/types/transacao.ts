// Só estes dois valores são aceitos. Qualquer outro texto dá erro de compilação.
export type TipoTransacao = "receita" | "despesa";

// "as const" trava a lista como valores fixos, e não como string genérica.
export const CATEGORIAS = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Lazer",
  "Saúde",
  "Educação",
  "Salário",
  "Outros",
] as const;

// Gera o tipo a partir da lista: "Moradia" | "Alimentação" | ...
// Assim a lista e o tipo nunca ficam desencontrados.
export type Categoria = (typeof CATEGORIAS)[number];

// A forma de uma transação em todo o app.
export interface Transacao {
  id: string;
  descricao: string;
  valorEmCentavos: number; // sempre positivo; o "tipo" define se soma ou subtrai
  data: string; // formato "2026-10-11"
  categoria: Categoria;
  tipo: TipoTransacao;
}
