import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

function traduzir(mensagem: string): string {
  if (mensagem.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (mensagem.includes("already registered")) return "Este e-mail já tem uma conta.";
  if (mensagem.includes("at least")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (mensagem.includes("Email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  return "Não foi possível concluir. Tente novamente.";
}

export default function Login() {
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setAviso("");
    setEnviando(true);

    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) setErro(traduzir(error.message));
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { data: { nome: nome.trim() } },
      });
      if (error) setErro(traduzir(error.message));
      else if (!data.session) setAviso("Conta criada! Confirme seu e-mail para entrar.");
    }

    setEnviando(false);
  }

  return (


    <div className="login-pagina">
      <form className="card login" onSubmit={aoEnviar}>
        <h1>FinFlow</h1>
        <h2>Seu controle financeiro na palma da sua mão</h2>
        <p className="vazio">
          {modo === "entrar" ? "Entre na sua conta" : "Crie sua conta"}
        </p>

        {modo === "criar" && (
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="given-name"
            maxLength={30}
            required
          />
        )}
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Senha (mínimo 6 caracteres)"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoComplete={modo === "entrar" ? "current-password" : "new-password"}
          required
        />

        <button type="submit" className="btn-primario" disabled={enviando}>
          {enviando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar conta"}
        </button>

        {erro && <p className="erro">{erro}</p>}
        {aviso && <p className="positivo">{aviso}</p>}

        <button
          type="button"
          className="btn-remover"
          onClick={() => {
            setModo(modo === "entrar" ? "criar" : "entrar");
            setErro("");
            setAviso("");
          }}
        >
          {modo === "entrar" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
        </button>
      </form>
    </div>
  );
}