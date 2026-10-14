import { supabase } from "./lib/supabase";
import { useSessao } from "./hooks/useSessao";
import Login from "./components/login";
import Painel from "./painel";

export default function App() {
  const { sessao, carregando } = useSessao();

  if (carregando) return <p className="app">Carregando…</p>;
  if (!sessao) return <Login />;

  return (
    <Painel
      email={sessao.user.email ?? ""}
      onSair={() => supabase.auth.signOut()}
    />
  );
}