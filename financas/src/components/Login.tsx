import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import CampoSenha from "./CampoSenha";

type Modo = "entrar" | "criar" | "recuperar";

function traduzir(mensagem: string): string {
  if (mensagem.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (mensagem.includes("already registered")) return "Este e-mail já tem uma conta.";
  if (mensagem.includes("at least")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (mensagem.includes("Email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (mensagem.includes("rate limit") || mensagem.includes("For security purposes")) {
    return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
  }
  return "Não foi possível concluir. Tente novamente.";
}

const TITULO: Record<Modo, string> = {
  entrar: "", // no login a frase fina já serve de título
  criar: "Crie sua conta",
  recuperar: "Recuperar senha",
};

const BOTAO: Record<Modo, string> = {
  entrar: "Entrar",
  criar: "Criar conta",
  recuperar: "Enviar link",
};

export default function Login() {
  const [modo, setModo] = useState<Modo>("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  function trocarModo(novo: Modo) {
    setModo(novo);
    setErro("");
    setAviso("");
  }

  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setAviso("");
    setEnviando(true);

    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) setErro(traduzir(error.message));
    } else if (modo === "criar") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { data: { nome: nome.trim() } },
      });
      if (error) setErro(traduzir(error.message));
      else if (!data.session) setAviso("Conta criada! Confirme seu e-mail para entrar.");
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });
      if (error) setErro(traduzir(error.message));
      else setAviso("Se esse e-mail tiver uma conta, enviamos um link para redefinir a senha. Confira também o spam.");
    }

    setEnviando(false);
  }

  return (
    <div className="login-pagina">
      <form className="login-form" onSubmit={aoEnviar}>
        <div className="login-logo">
          <img className="login-icone" src="/logo-finflow.png" alt="" width={40} height={40} />
          <strong>Finflow</strong>
        </div>

        <h1 className="login-frase">
          <span>Sua vida financeira</span>
          <span className="destaque">organizada</span>
          <span className="fim">sem complicação</span>
        </h1>

        {TITULO[modo] && <h2 className="login-subtitulo">{TITULO[modo]}</h2>}

        {modo === "recuperar" && (
          <p className="login-texto">Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>
        )}

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

        {modo !== "recuperar" && (
          <CampoSenha
            rotulo="Senha"
            placeholder="Digite sua senha"
            valor={senha}
            onChange={setSenha}
            autoComplete={modo === "entrar" ? "current-password" : "new-password"}
            dica={modo === "criar" ? "Mínimo de 6 caracteres." : undefined}
          />
        )}

        {modo === "entrar" && (
          <button type="button" className="login-link" onClick={() => trocarModo("recuperar")}>
            Esqueci minha senha
          </button>
        )}

        <button type="submit" className="btn-primario" disabled={enviando}>
          {enviando ? "Aguarde..." : BOTAO[modo]}
        </button>

        {erro && <p className="erro">{erro}</p>}
        {aviso && <p className="positivo">{aviso}</p>}

        <p className="login-troca">
          {modo === "entrar" ? "Não tem conta?" : modo === "criar" ? "Já tem conta?" : "Lembrou a senha?"}{" "}
          <button type="button" onClick={() => trocarModo(modo === "entrar" ? "criar" : "entrar")}>
            {modo === "entrar" ? "Criar conta" : "Entrar"}
          </button>
        </p>
      </form>
    </div>
  );
}
