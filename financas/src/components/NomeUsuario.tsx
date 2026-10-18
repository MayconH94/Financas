import { useState, type FormEvent } from "react";
import { Pencil } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type Props = { usuario: User };

export default function NomeUsuario({ usuario }: Props) {
  const salvo = usuario.user_metadata?.nome;
  const [nome, setNome] = useState(typeof salvo === "string" ? salvo.trim() : "");
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const primeiro = nome.split(" ")[0];

  function comecar() {
    setRascunho(nome);
    setErro("");
    setEditando(true);
  }

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const limpo = rascunho.trim();
    if (!limpo) {
      setEditando(false);
      return;
    }
    setSalvando(true);
    const { error } = await supabase.auth.updateUser({ data: { nome: limpo } });
    setSalvando(false);
    if (error) {
      setErro("Não foi possível salvar o nome.");
      return;
    }
    setNome(limpo);
    setEditando(false);
  }

  if (editando) {
    return (
      <form className="nome-form" onSubmit={salvar}>
        <input
          value={rascunho}
          onChange={(e) => setRascunho(e.target.value)}
          placeholder="Seu nome"
          maxLength={30}
          autoFocus
        />
        <button type="submit" disabled={salvando}>
          {salvando ? "…" : "OK"}
        </button>
        {erro && <span className="nome-erro">{erro}</span>}
      </form>
    );
  }

  return (
    <button type="button" className="nome-btn" onClick={comecar} title="Editar nome">
      <span className="nome-texto">{primeiro ? `Olá, ${primeiro}` : "Adicionar nome"}</span>
      <Pencil size={14} />
    </button>
  );
}
