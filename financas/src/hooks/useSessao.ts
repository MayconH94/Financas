import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export function useSessao() {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // sessão que já existia (o login fica salvo no navegador)
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session);
      setCarregando(false);
    });

    // avisa quando a pessoa entra ou sai
    const { data } = supabase.auth.onAuthStateChange((_evento, nova) => {
      setSessao(nova);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return { sessao, carregando };
}