import type { Transacao } from "../types/transacao";
import { formatarMoeda } from "../utils/dinheiro";

type Props = {
  transacoes: Transacao[];
};

export default function ResumoCategorias({ transacoes }: Props) {
  // 1. Soma as despesas de cada categoria
  const totais = new Map<string, number>();
  for (const t of transacoes) {
    if (t.tipo !== "despesa") continue;
    totais.set(t.categoria, (totais.get(t.categoria) ?? 0) + t.valorEmCentavos);
  }

  // 2. Transforma em lista ordenada da maior para a menor
  const lista = [...totais.entries()]
    .map(([categoria, total]) => ({ categoria, total }))
    .sort((a, b) => b.total - a.total);

  const totalGeral = lista.reduce((soma, item) => soma + item.total, 0);

    if (lista.length === 0) {
    return (
      <section className="card">
        <h2>Despesas por categoria</h2>
        <p className="vazio">Sem despesas neste mês.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Despesas por categoria</h2>
      {lista.map(({ categoria, total }) => {
        const percentual = (total / totalGeral) * 100;
        return (
          <div key={categoria} className="categoria">
            <div className="categoria-linha">
              <span>{categoria}</span>
              <span>
                {formatarMoeda(total)} ({percentual.toFixed(0)}%)
              </span>
            </div>
            <div className="barra">
              <div className="barra-preenchida" style={{ width: `${percentual}%` }} />
            </div>
          </div>
        );
      })}
    </section>
)};