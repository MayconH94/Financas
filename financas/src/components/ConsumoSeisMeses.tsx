import type { Transacao } from "../types/transacao";
import { consumoUltimosMeses } from "../utils/consumoSeisMeses";
import { CATEGORIA } from "../utils/categorias";
import { formatarMoeda } from "../utils/dinheiro";

type Props = { transacoes: Transacao[]; mesFinal: string };

const RAIO = 42;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

export default function ConsumoSeisMeses({ transacoes, mesFinal }: Props) {
  const { itens, total, periodo } = consumoUltimosMeses(transacoes, mesFinal);

  // onde cada fatia começa, somando as anteriores
  const fatias = itens.map((item, i) => ({
    ...item,
    inicio: itens.slice(0, i).reduce((s, x) => s + x.total, 0),
  }));

  return (
    <section className="consumo-card">
      <h2>Consumo dos últimos 6 meses</h2>
      <p className="consumo-sub">{periodo}</p>

      {total === 0 ? (
        <p className="consumo-vazio">Sem despesas neste período.</p>
      ) : (
        <>
          <svg viewBox="0 0 100 100" className="consumo-rosca" role="img" aria-label="Despesas por categoria nos últimos 6 meses">
            <circle cx={50} cy={50} r={RAIO} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={14} />
            {fatias.map((f) => {
              const comprimento = (f.total / total) * CIRCUNFERENCIA;
              return (
                <circle
                  key={f.categoria}
                  cx={50}
                  cy={50}
                  r={RAIO}
                  fill="none"
                  stroke={CATEGORIA[f.categoria].cor}
                  strokeWidth={14}
                  strokeDasharray={`${comprimento} ${CIRCUNFERENCIA - comprimento}`}
                  strokeDashoffset={-(f.inicio / total) * CIRCUNFERENCIA}
                  transform="rotate(-90 50 50)"
                />
              );
            })}
            <text x={50} y={46} textAnchor="middle" className="consumo-rotulo">
              Total
            </text>
            <text x={50} y={58} textAnchor="middle" className="consumo-valor">
              {formatarMoeda(total)}
            </text>
          </svg>

          <ul className="consumo-legenda">
            {itens.map((i) => (
              <li key={i.categoria}>
                <span className="consumo-ponto" style={{ background: CATEGORIA[i.categoria].cor }} />
                <span className="consumo-nome">{i.categoria}</span>
                <span className="consumo-pct">{Math.round((i.total / total) * 100)}%</span>
                <span>{formatarMoeda(i.total)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
