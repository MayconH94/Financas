import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Parcelamento, NovoParcelamento } from "../utils/parcelamentos";

type Linha = {
  id: string;
  descricao: string;
  valor_total_em_centavos: number;
  parcelas: number;
  primeira_parcela: string;
  categoria: Parcelamento["categoria"];
};

const COLUNAS = "id, descricao, valor_total_em_centavos, parcelas, primeira_parcela, categoria";

function deLinha(l: Linha): Parcelamento {
  return {
    id: l.id,
    descricao: l.descricao,
    valorTotalEmCentavos: l.valor_total_em_centavos,
    parcelas: l.parcelas,
    primeiraParcela: l.primeira_parcela,
    categoria: l.categoria,
  };
}

export function useParcelamentos() {
  const [parcelamentos, setParcelamentos] = useState<Parcelamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    supabase
      .from("parcelamentos")
      .select(COLUNAS)
      .order("primeira_parcela", { ascending: false })
      .then(({ data, error }) => {
        if (!ativo) return;
        if (error) setErro("Não foi possível carregar suas compras parceladas.");
        else setParcelamentos((data as Linha[]).map(deLinha));
        setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function adicionar(dados: NovoParcelamento) {
    setErro("");
    const { data, error } = await supabase
      .from("parcelamentos")
      .insert({
        descricao: dados.descricao,
        valor_total_em_centavos: dados.valorTotalEmCentavos,
        parcelas: dados.parcelas,
        primeira_parcela: dados.primeiraParcela,
        categoria: dados.categoria,
      })
      .select(COLUNAS)
      .single();

    if (error) {
      setErro("Não foi possível salvar a compra parcelada.");
      return;
    }
    setParcelamentos((atual) => [deLinha(data as Linha), ...atual]);
  }

  async function editar(id: string, dados: NovoParcelamento): Promise<boolean> {
    setErro("");
    const { data, error } = await supabase
      .from("parcelamentos")
      .update({
        descricao: dados.descricao,
        valor_total_em_centavos: dados.valorTotalEmCentavos,
        parcelas: dados.parcelas,
        primeira_parcela: dados.primeiraParcela,
        categoria: dados.categoria,
      })
      .eq("id", id)
      .select(COLUNAS)
      .single();

    if (error) {
      setErro("Não foi possível editar a compra parcelada.");
      return false;
    }
    const atualizado = deLinha(data as Linha);
    setParcelamentos((atual) => atual.map((p) => (p.id === id ? atualizado : p)));
    return true;
  }

  async function remover(id: string) {
    setErro("");
    const { error } = await supabase.from("parcelamentos").delete().eq("id", id);

    if (error) {
      setErro("Não foi possível remover a compra parcelada.");
      return;
    }
    setParcelamentos((atual) => atual.filter((p) => p.id !== id));
  }

  return { parcelamentos, carregando, erro, adicionar, editar, remover };
}
