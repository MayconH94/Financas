import { useCallback, useState } from "react";

export type Tema = "claro" | "escuro";

const CHAVE = "finflow-tema";
const COR_BARRA: Record<Tema, string> = { claro: "#f4f5f7", escuro: "#1b1d21" };

function temaSalvo(): Tema | null {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === "claro" || v === "escuro" ? v : null;
  } catch {
    return null;
  }
}

function temaInicial(): Tema {
  return temaSalvo() ?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "claro" : "escuro");
}

function aplicar(tema: Tema) {
  document.documentElement.dataset.theme = tema === "claro" ? "light" : "dark";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", COR_BARRA[tema]);
}

// Tema claro/escuro: começa pelo que o usuário escolheu, senão pelo sistema.
export function useTema() {
  const [tema, setTema] = useState<Tema>(temaInicial);

  const alternar = useCallback(() => {
    const novo: Tema = tema === "claro" ? "escuro" : "claro";
    aplicar(novo);
    try {
      localStorage.setItem(CHAVE, novo);
    } catch {
      // sem armazenamento: vale só nesta sessão
    }
    setTema(novo);
  }, [tema]);

  return { tema, alternar };
}
