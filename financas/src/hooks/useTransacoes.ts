import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Transacao } from "../types/transacao";

type NovaTransacao = Omit<Transacao, "id">;

// como a linha vem do banco (snake_case)
type Linha = {
  id: string;
  descricao: string;
  valor_em_centavos: number;
  data: string;
  categoria: Transacao["categoria"];
  tipo: Transacao["tipo"];
};

const COLUNAS = "id, descricao, valor_em_centavos, data, categoria, tipo";

// converte banco -> app
function deLinha(l: Linha): Transacao {
  return {
    id: l.id,
    descricao: l.descricao,
    valorEmCentavos: l.valor_em_centavos,
    data: l.data,
    categoria: l.categoria,
    tipo: l.tipo,
  };
}

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // carrega as transações da conta logada
  useEffect(() => {
    let ativo = true;

    supabase
      .from("transacoes")
      .select(COLUNAS)
      .order("data", { ascending: false })
      .then(({ data, error }) => {
        if (!ativo) return;
        if (error) setErro("Não foi possível carregar suas transações.");
        else setTransacoes((data as Linha[]).map(deLinha));
        setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function adicionar(dados: NovaTransacao) {
    setErro("");
    const { data, error } = await supabase
      .from("transacoes")
      .insert({
        descricao: dados.descricao,
        valor_em_centavos: dados.valorEmCentavos, // app -> banco
        data: dados.data,
        categoria: dados.categoria,
        tipo: dados.tipo,
      })
      .select(COLUNAS)
      .single();

    if (error) {
      setErro("Não foi possível salvar a transação.");
      return;
    }
    setTransacoes((atual) => [deLinha(data as Linha), ...atual]);
  }

  async function remover(id: string) {
    setErro("");
    const { error } = await supabase.from("transacoes").delete().eq("id", id);

    if (error) {
      setErro("Não foi possível remover a transação.");
      return;
    }
    setTransacoes((atual) => atual.filter((t) => t.id !== id));
  }

  return { transacoes, carregando, erro, adicionar, remover };
}