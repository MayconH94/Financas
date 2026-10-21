import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// "Total" = meta geral de despesas do mês; as demais usam o nome da categoria
export type Metas = Record<string, { id: string; limiteEmCentavos: number }>;

type Linha = { id: string; categoria: string; limite_em_centavos: number };

export function useMetas() {
  const [metas, setMetas] = useState<Metas>({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    supabase
      .from("metas")
      .select("id, categoria, limite_em_centavos")
      .then(({ data, error }) => {
        if (!ativo) return;
        if (error) setErro("Não foi possível carregar suas metas.");
        else {
          const mapa: Metas = {};
          for (const l of data as Linha[]) mapa[l.categoria] = { id: l.id, limiteEmCentavos: l.limite_em_centavos };
          setMetas(mapa);
        }
        setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function salvar(categoria: string, limiteEmCentavos: number): Promise<boolean> {
    setErro("");
    const existente = metas[categoria];

    const consulta = existente
      ? supabase.from("metas").update({ limite_em_centavos: limiteEmCentavos }).eq("id", existente.id)
      : supabase.from("metas").insert({ categoria, limite_em_centavos: limiteEmCentavos });

    const { data, error } = await consulta.select("id, categoria, limite_em_centavos").single();
    if (error) {
      setErro("Não foi possível salvar a meta.");
      return false;
    }
    const l = data as Linha;
    setMetas((atual) => ({ ...atual, [l.categoria]: { id: l.id, limiteEmCentavos: l.limite_em_centavos } }));
    return true;
  }

  async function remover(categoria: string) {
    setErro("");
    const existente = metas[categoria];
    if (!existente) return;

    const { error } = await supabase.from("metas").delete().eq("id", existente.id);
    if (error) {
      setErro("Não foi possível remover a meta.");
      return;
    }
    setMetas((atual) => {
      const copia = { ...atual };
      delete copia[categoria];
      return copia;
    });
  }

  return { metas, carregando, erro, salvar, remover };
}
