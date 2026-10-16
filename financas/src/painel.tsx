
import { useState } from "react";
import { calcularSaldo, formatarMoeda } from "./utils/dinheiro";
import { useTransacoes } from "./hooks/useTransacoes";
import FormularioTransacao from "./components/FormularioTransacao";
import ResumoCategorias from "./components/ResumoCategorias";
import IconeCategoria from "./components/IconeCategoria";
import type { User } from "@supabase/supabase-js";
import Avatar from "./components/Avatar";


const mesAtual = () => new Date().toLocaleDateString("sv-SE").slice(0, 7); // AAAA-MM

type Props = {
  usuario: User;
  email: string;
  onSair: () => void; 
};

export default function Painel({ usuario, email, onSair }: Props) {
  const { transacoes, carregando, erro, adicionar, remover } = useTransacoes();
  const [mes, setMes] = useState(mesAtual());

  const doMes = transacoes
    .filter((t) => t.data.startsWith(mes))
    .sort((a, b) => b.data.localeCompare(a.data));

  const receitas = doMes
    .filter((t) => t.tipo === "receita")
    .reduce((soma, t) => soma + t.valorEmCentavos, 0);
  const despesas = doMes
    .filter((t) => t.tipo === "despesa")
    .reduce((soma, t) => soma + t.valorEmCentavos, 0);

  const saldo = calcularSaldo(doMes);

    return (
    <div className="shell">
      <aside className="sidebar">
        <div className="marca">
          <span className="marca-logo">$</span>
          <span>Gestão Financeira</span>
        </div>

        <nav className="menu">
          <button className="menu-item ativo">Visão geral</button>
        </nav>

        <div className="sidebar-rodape">
          <small>{email}</small>
          <Avatar usuario={usuario}/>
          <button className="btn-sair" onClick={onSair}>Sair</button>
        </div>
      </aside>

      <main className="conteudo">
        <header className="topo">
          <div>
            <h1>Dashboard</h1>
            <p className="subtitulo">Visão geral das suas finanças</p>
          </div>
          <label className="seletor-mes">
            Mês
            <input type="month" value={mes} onChange={(e) => setMes(e.target.value)} />
          </label>
        </header>

        <section className="grade-topo">
          <div className="card card-destaque">
            <span className="rotulo">Saldo do mês</span>
            <strong className={`valor-grande ${saldo < 0 ? "negativo" : ""}`}>
              {formatarMoeda(saldo)}
            </strong>
          </div>
          <div className="card">
            <span className="rotulo">Receitas</span>
            <strong className="valor-grande positivo">{formatarMoeda(receitas)}</strong>
          </div>
          <div className="card">
            <span className="rotulo">Despesas</span>
            <strong className="valor-grande negativo">{formatarMoeda(despesas)}</strong>
          </div>
        </section>

        <section className="grade-meio">
          <ResumoCategorias transacoes={doMes} />
          <FormularioTransacao onAdicionar={adicionar} />
        </section>

        <section className="card">
          <h2>Transações recentes</h2>
          {erro && <p className="erro">{erro}</p>}
          {carregando ? (
            <p className="vazio">Carregando…</p>
          ) : doMes.length === 0 ? (
            <p className="vazio">Nenhuma transação neste mês.</p>
          ) : (
            <ul className="lista">
              {doMes.map((t) => (
                <li key={t.id} className="item">
                  <IconeCategoria categoria={t.categoria} />
                    <div className="item-info">
                      <strong>{t.descricao}</strong>
                      <small>{t.data} · {t.categoria}</small>
                  </div>
                  <span className={`item-valor ${t.tipo === "despesa" ? "negativo" : "positivo"}`}>
                    {t.tipo === "despesa" ? "-" : "+"}
                    {formatarMoeda(t.valorEmCentavos)}
                  </span>
                  <button className="btn-remover" onClick={() => remover(t.id)}>
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}