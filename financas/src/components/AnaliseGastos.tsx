import type { Transacao } from "../types/transacao";
import { formatarMoeda } from "../utils/dinheiro";
import { dataBR } from "../utils/datas";
import { CATEGORIA } from "../utils/categorias";
import { despesasDoMes, gastosPorCategoria, maioresDespesas } from "../utils/gastos";

type Props = { transacoes: Transacao[]; mes: string };

export default function AnaliseGastos({ transacoes, mes }: Props) {
  const despesas = despesasDoMes(transacoes, mes);
  const categorias = gastosPorCategoria(despesas);
  const maiores = maioresDespesas(despesas, 5);
  const lider = categorias[0];

  return (
    <section className="card">
      <h2>Maiores gastos do mês</h2>

      {despesas.length === 0 ? (
        <p className="vazio">Nenhuma despesa neste mês.</p>
      ) : (
        <>
          <p className="subtitulo">
            Sua maior fatia é <strong>{lider.categoria}</strong>, com {Math.round(lider.percentual)}% das despesas
            ({formatarMoeda(lider.totalEmCentavos)}).
          </p>

          <ul className="ranking">
            {categorias.map((c) => (
              <li key={c.categoria}>
                <div className="ranking-linha">
                  <span>{c.categoria}</span>
                  <span>
                    {formatarMoeda(c.totalEmCentavos)} · {Math.round(c.percentual)}%
                  </span>
                </div>
                <div className="barra">
                  <div
                    className="barra-preenchida"
                    style={{ width: `${c.percentual}%`, background: CATEGORIA[c.categoria].cor }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <h3 className="subtitulo-secao">Maiores despesas individuais</h3>
          <ul className="lista">
            {maiores.map((t) => (
              <li key={t.id} className="item-simples">
                <div className="item-info">
                  <strong>{t.descricao}</strong>
                  <small>
                    {dataBR(t.data)} · {t.categoria}
                  </small>
                </div>
                <span className="item-valor negativo">-{formatarMoeda(t.valorEmCentavos)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
