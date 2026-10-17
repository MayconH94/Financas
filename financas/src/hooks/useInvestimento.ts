import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Investimento, NovoInvestimento, TipoInvestimento } from "../types/investimento";

type Linha = {
  id: string;
  tipo: TipoInvestimento;
  nome: string;
  codigo: string | null;
  data_compra: string;
  quantidade: number;
  valor_investido_em_centavos: number;
  valor_atual_em_centavos: number | null;
  vencimento: string | null;
  observacao: string | null;
};

function paraInvestimento(l: Linha): Investimento {
  return {
    id: l.id,
    tipo: l.tipo,
    nome: l.nome,
    codigo: l.codigo,
    dataCompra: l.data_compra,
    quantidade: Number(l.quantidade),
    valorInvestidoEmCentavos: Number(l.valor_investido_em_centavos),
    valorAtualEmCentavos: l.valor_atual_em_centavos === null ? null : Number(l.valor_atual_em_centavos),
    vencimento: l.vencimento,
    observacao: l.observacao,
  };
}

export function useInvestimentos() {
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const { data, error } = await supabase
        .from("investimentos")
        .select("*")
        .order("data_compra", { ascending: false });

      if (!ativo) return;
      if (error) setErro("Não foi possível carregar os investimentos.");
      else setInvestimentos((data as Linha[]).map(paraInvestimento));
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  async function adicionar(dados: NovoInvestimento) {
    setErro("");
    const { data, error } = await supabase
      .from("investimentos")
      .insert({
        tipo: dados.tipo,
        nome: dados.nome,
        codigo: dados.codigo,
        data_compra: dados.dataCompra,
        quantidade: dados.quantidade,
        valor_investido_em_centavos: dados.valorInvestidoEmCentavos,
        valor_atual_em_centavos: dados.valorAtualEmCentavos,
        vencimento: dados.vencimento,
        observacao: dados.observacao,
      })
      .select()
      .single();

    if (error) {
      setErro("Não foi possível salvar o investimento.");
      return;
    }
    setInvestimentos((atual) => [paraInvestimento(data as Linha), ...atual]);
  }

  async function remover(id: string) {
    setErro("");
    const { error } = await supabase.from("investimentos").delete().eq("id", id);
    if (error) {
      setErro("Não foi possível remover o investimento.");
      return;
    }
    setInvestimentos((atual) => atual.filter((i) => i.id !== id));
  }

  return { investimentos, carregando, erro, adicionar, remover };
}