import {
    Banknote, House, Utensils, Car, Gamepad2, HeartPulse, GraduationCap, Tag,    
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Transacao } from "../types/transacao";

export type Categoria = Transacao["categoria"];

export const CATEGORIA: Record<Categoria, { icone: LucideIcon; cor: string }> = {
    "Salário":     { icone: Banknote,      cor: "#34d399" },
  "Moradia":     { icone: House,         cor: "#fb923c" },
  "Alimentação": { icone: Utensils,      cor: "#a3e635" },
  "Transporte":  { icone: Car,           cor: "#38bdf8" },
  "Lazer":       { icone: Gamepad2,      cor: "#e879f9" },
  "Saúde":       { icone: HeartPulse,    cor: "#fb7185" },
  "Educação":    { icone: GraduationCap, cor: "#818cf8" },
  "Outros":      { icone: Tag,           cor: "#94a3b8" },
};

// lista na mesma ordem, para usar em seletores
export const LISTA_CATEGORIA = Object.keys(CATEGORIA) as Categoria[];