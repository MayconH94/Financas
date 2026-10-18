import { useEffect, useState } from "react";

export type Cambio = { data: string; taxas: Record<string, number> };

export function useMoedas() {
  const [cambio, setCambio] = useState<Cambio | null>(null);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    let ativo = true;

    fetch("/api/moedas")
      .then((resposta) => {
        if (!resposta.ok) throw new Error("câmbio indisponível");
        return resposta.json() as Promise<Cambio>;
      })
      .then((dados) => {
        if (ativo) setCambio(dados);
      })
      .catch(() => {
        if (ativo) setFalhou(true);
      });

    return () => {
      ativo = false;
    };
  }, []);

  return { cambio, falhou, carregando: cambio === null && !falhou };
}
