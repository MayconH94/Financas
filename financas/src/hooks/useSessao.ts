import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export function useSessao() {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [recuperando, setRecuperando] = useState(false); // abriu o link de "esqueci minha senha"

  useEffect(() => {
    // sessão que já existia (o login fica salvo no navegador)
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session);
      setCarregando(false);
    });

    // avisa quando a pessoa entra ou sai
    const { data } = supabase.auth.onAuthStateChange((evento, nova) => {
      setSessao(nova);
      if (evento === "PASSWORD_RECOVERY") setRecuperando(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return { sessao, carregando, recuperando, concluirRecuperacao: () => setRecuperando(false) };
}