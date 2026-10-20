import { supabase } from "./lib/supabase";
import { useSessao } from "./hooks/useSessao";
import Login from "./components/Login";
import NovaSenha from "./components/NovaSenha";
import Painel from "./Painel";

export default function App() {
  const { sessao, carregando, recuperando, concluirRecuperacao } = useSessao();

  if (carregando) return <p className="app">Carregando…</p>;
  if (!sessao) return <Login />;
  if (recuperando) return <NovaSenha onConcluir={concluirRecuperacao} />;

  return (
    <Painel usuario={sessao.user} email={sessao.user.email ?? ""} onSair={() => supabase.auth.signOut()} />
  );
}