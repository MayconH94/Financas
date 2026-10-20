import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import CampoSenha from "./CampoSenha";

type Props = { onConcluir: () => void };

// Tela exibida depois que a pessoa abre o link de "esqueci minha senha" do e-mail
export default function NovaSenha({ onConcluir }: Props) {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    if (senha.length < 6) return setErro("A senha precisa ter pelo menos 6 caracteres.");
    if (senha !== confirmacao) return setErro("As senhas não são iguais.");

    setEnviando(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setEnviando(false);

    if (error) setErro("Não foi possível salvar a nova senha. Peça um novo link e tente de novo.");
    else onConcluir();
  }

  return (
    <div className="login-pagina">
      <form className="login-form" onSubmit={aoEnviar}>
        <div className="login-logo">
          <span className="marca-logo">$</span>
          <strong>Finflow</strong>
        </div>

        <h2 className="login-subtitulo">Criar nova senha</h2>

        <CampoSenha
          rotulo="Nova senha"
          valor={senha}
          onChange={setSenha}
          autoComplete="new-password"
          dica="Mínimo de 6 caracteres."
        />
        <CampoSenha rotulo="Confirmar senha" valor={confirmacao} onChange={setConfirmacao} autoComplete="new-password" />

        <button type="submit" className="btn-primario" disabled={enviando}>
          {enviando ? "Aguarde..." : "Salvar nova senha"}
        </button>

        {erro && <p className="erro">{erro}</p>}
      </form>
    </div>
  );
}
