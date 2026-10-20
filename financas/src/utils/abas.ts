import { LayoutDashboard, ArrowLeftRight, FileText, TrendingUp, CircleDollarSign, GraduationCap, CreditCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Aba = "visao" | "transacoes" | "relatorios" | "investimentos" | "conversor" | "aprender" | "parcelas";

export const ABAS: { id: Aba; nome: string; icone: LucideIcon }[] = [
  { id: "visao", nome: "Visão geral", icone: LayoutDashboard },
  { id: "transacoes", nome: "Transações", icone: ArrowLeftRight },
  { id: "parcelas", nome: "Parcelas", icone: CreditCard },
  { id: "relatorios", nome: "Relatórios", icone: FileText },
  { id: "investimentos", nome: "Investimentos", icone: TrendingUp },
  { id: "conversor", nome: "Conversor", icone: CircleDollarSign },
  { id: "aprender", nome: "Aprender", icone: GraduationCap },
];
