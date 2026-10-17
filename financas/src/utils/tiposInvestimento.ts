import { TrendingUp, Building2, Bitcoin, Landmark, PiggyBank, Coins } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TipoInvestimento } from "../types/investimento";

export const TIPOS: Record<
  TipoInvestimento,
  { rotulo: string; icone: LucideIcon; cor: string; temCodigo: boolean }
> = {
  acao: { rotulo: "Ações", icone: TrendingUp, cor: "#38bdf8", temCodigo: true },
  fii: { rotulo: "FIIs", icone: Building2, cor: "#fb923c", temCodigo: true },
  cripto: { rotulo: "Cripto", icone: Bitcoin, cor: "#facc15", temCodigo: true },
  tesouro: { rotulo: "Tesouro", icone: Landmark, cor: "#34d399", temCodigo: false },
  renda_fixa: { rotulo: "Renda fixa", icone: PiggyBank, cor: "#a3e635", temCodigo: false },
  outro: { rotulo: "Outros", icone: Coins, cor: "#94a3b8", temCodigo: false },
};

export const LISTA_TIPOS = Object.keys(TIPOS) as TipoInvestimento[];