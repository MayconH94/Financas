import {
    Banknote, House, Utensils, Car, Gamepad2, HeartPulse, GraduationCap, Tag,    
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Transacao, TipoTransacao } from "../types/transacao";

export type Categoria = Transacao["categoria"];

export const CATEGORIA: Record<Categoria, { icone: LucideIcon; cor: string }> = {
    "Salário":     { icone: Banknote,      cor: "#9fd356" },
  "Moradia":     { icone: House,         cor: "#8b9cc9" },
  "Alimentação": { icone: Utensils,      cor: "#e0a458" },
  "Transporte":  { icone: Car,           cor: "#5aa9c9" },
  "Lazer":       { icone: Gamepad2,      cor: "#a78bc9" },
  "Saúde":       { icone: HeartPulse,    cor: "#d97b86" },
  "Educação":    { icone: GraduationCap, cor: "#6fbf9e" },
  "Outros":      { icone: Tag,           cor: "#8a9099" },
};

// lista na mesma ordem, para usar em seletores
export const LISTA_CATEGORIA = Object.keys(CATEGORIA) as Categoria[];

// receita só combina com Salário/Outros; despesa com todas as demais
export const CATEGORIAS_RECEITA: Categoria[] = ["Salário", "Outros"];
export const CATEGORIAS_DESPESA = LISTA_CATEGORIA.filter((c) => c !== "Salário");

export function categoriasDoTipo(tipo: TipoTransacao): Categoria[] {
  return tipo === "receita" ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;
}