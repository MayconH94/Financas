import { ArrowLeftRight, FileText, TrendingUp, CircleDollarSign, GraduationCap, CreditCard } from "lucide-react";
import type { ComponentType } from "react";
import IconeVisaoGeral from "../components/IconeVisaoGeral";

export type Aba = "visao" | "transacoes" | "relatorios" | "investimentos" | "conversor" | "aprender" | "parcelas";

export const ABAS: { id: Aba; nome: string; icone: ComponentType<{ size?: number | string }> }[] = [
  { id: "visao", nome: "Visão geral", icone: IconeVisaoGeral },
  { id: "transacoes", nome: "Transações", icone: ArrowLeftRight },
  { id: "parcelas", nome: "Parcelas", icone: CreditCard },
  { id: "relatorios", nome: "Relatórios", icone: FileText },
  { id: "investimentos", nome: "Investimentos", icone: TrendingUp },
  { id: "conversor", nome: "Conversor", icone: CircleDollarSign },
  { id: "aprender", nome: "Aprender", icone: GraduationCap },
];
