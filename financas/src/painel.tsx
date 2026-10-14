import { useState } from "react";
import { calcularSaldo, formatarMoeda } from "./utils/dinheiro";
import { useTransacoes } from "./hooks/useTransacoes";
import FormularioTransacao from "./components/FormularioTransacao";
import ResumoCategorias from "./components/ResumoCategorias";

const mesAtual = () => new Date().toLocaleDateString("sv-SE").slice(0, 7); // AAAA-MM

type Props = {
  email: string;
  onSair: () => void;
};

export default function Painel({ email, onSair }: Props) {
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

  return (
    <div className="app">
      <header className="topo">
        <h1>Visão geral financeira</h1>
        <label>
          Mês
          <input type="month" value={mes} onChange={(e) => setMes(e.target.value)} />
        </label>
        <div>
          <small className="vazio">{email}</small>{" "}
          <button className="btn-remover" onClick={onSair}>Sair</button>
        </div>
      </header>

      <section className="cards-resumo">
        <div className="card">
          <span>Saldo do mês</span>
          <strong className={calcularSaldo(doMes) < 0 ? "negativo" : ""}>
            {formatarMoeda(calcularSaldo(doMes))}
          </strong>
        </div>
        <div className="card">
          <span>Receitas</span>
          <strong className="positivo">{formatarMoeda(receitas)}</strong>
        </div>
        <div className="card">
          <span>Despesas</span>
          <strong className="negativo">{formatarMoeda(despesas)}</strong>
        </div>
      </section>

      <ResumoCategorias transacoes={doMes} />

      <FormularioTransacao onAdicionar={adicionar} />

      <section className="card">
        <h2>Transações</h2>
        {erro && <p className="erro">{erro}</p>}
        {carregando ? (
          <p className="vazio">Carregando…</p>
        ) : doMes.length === 0 ? (
          <p className="vazio">Nenhuma transação neste mês.</p>
        ) : (
          <ul className="lista">
            {doMes.map((t) => (
              <li key={t.id} className="item">
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
    </div>
  );
}