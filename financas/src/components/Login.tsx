import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  const [verSenha, setVerSenha] = useState(false);

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

  function trocarModo(novo: "entrar" | "criar") {
    setModo(novo);
    setErro("");
    setAviso("");
  }

  return (
    <div className="login-pagina">
      <form className="login-form" onSubmit={aoEnviar}>
        <div className="login-logo">
          <span className="marca-logo">$</span>
          <strong>Finflow</strong>
          
        </div>

        <h1>{modo === "entrar" ? "Seu controle financeiro na palma da sua mão!" : "Crie sua conta"}</h1>

        {modo === "criar" && (
          <label className="login-campo">
            Nome
            <input
              type="text"
              placeholder="Como quer ser chamado"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="given-name"
              maxLength={30}
              required
            />
          </label>
        )}

        <label className="login-campo">
          E-mail
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="login-campo">
          Senha
          <span className="login-senha">
            <input
              type={verSenha ? "text" : "password"}
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete={modo === "entrar" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setVerSenha(!verSenha)}
              aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
          {modo === "criar" && <small>Mínimo de 6 caracteres.</small>}
        </label>

        <button type="submit" className="btn-primario" disabled={enviando}>
          {enviando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar conta"}
        </button>

        {erro && <p className="erro">{erro}</p>}
        {aviso && <p className="positivo">{aviso}</p>}

        <p className="login-troca">
          {modo === "entrar" ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button type="button" onClick={() => trocarModo(modo === "entrar" ? "criar" : "entrar")}>
            {modo === "entrar" ? "Criar conta" : "Entrar"}
          </button>
        </p>
      </form>
    </div>
  );
}
