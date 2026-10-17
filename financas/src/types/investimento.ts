export type TipoInvestimento = "acao" | "fii" | "cripto" | "tesouro" | "renda_fixa" | "outro";

export type Investimento = {
  id: string;
  tipo: TipoInvestimento;
  nome: string;
  codigo: string | null;
  dataCompra: string; // AAAA-MM-DD
  quantidade: number;
  valorInvestidoEmCentavos: number;
  valorAtualEmCentavos: number | null;
  vencimento: string | null;
  observacao: string | null;
};

export type NovoInvestimento = Omit<Investimento, "id">;

export type Cotacao = {
  codigo: string;
  precoEmCentavos: number;
};