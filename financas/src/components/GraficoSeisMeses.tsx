import { useState } from "react";
import type { Transacao } from "../types/transacao";
import { resumoUltimosMeses } from "../utils/seisMeses";
import { formatarMoeda } from "../utils/dinheiro";

type Props = { transacoes: Transacao[]; mesFinal: string };

const LARGURA = 320;
const ALTURA = 150;
const BASE = 128; // linha do zero
const BARRA = 16;

export default function GraficoSeisMeses({ transacoes, mesFinal }: Props) {
  const meses = resumoUltimosMeses(transacoes, mesFinal);
  const [escolhido, setEscolhido] = useState<string | null>(null);

  const ativo = meses.find((m) => m.chave === escolhido) ?? meses[meses.length - 1];
  const maximo = Math.max(1, ...meses.flatMap((m) => [m.receitas, m.despesas]));
  const larguraGrupo = LARGURA / meses.length;

  const altura = (valor: number) =>
    valor > 0 ? Math.max(3, (valor / maximo) * (BASE - 8)) : 0;

  return (
    <section className="grafico-card">
      <h2>Receitas x despesas</h2>
      <p className="grafico-sub">Últimos 6 meses · toque numa barra para ver os valores</p>

      <svg
        viewBox={`0 0 ${LARGURA} ${ALTURA}`}
        className="barras"
        role="img"
        aria-label="Receitas e despesas dos últimos 6 meses"
      >
        {meses.map((m, i) => {
          const x0 = i * larguraGrupo;
          const meio = x0 + larguraGrupo / 2;
          const selecionado = m.chave === ativo.chave;
          return (
            <g key={m.chave} className="barras-grupo" onClick={() => setEscolhido(m.chave)}>
              <rect
                x={x0 + 2}
                y={0}
                width={larguraGrupo - 4}
                height={ALTURA}
                rx={8}
                className={selecionado ? "barras-fundo sel" : "barras-fundo"}
              />
              <rect
                x={meio - BARRA - 2}
                y={BASE - altura(m.receitas)}
                width={BARRA}
                height={altura(m.receitas)}
                rx={3}
                className="barra-receita"
              />
              <rect
                x={meio + 2}
                y={BASE - altura(m.despesas)}
                width={BARRA}
                height={altura(m.despesas)}
                rx={3}
                className="barra-despesa"
              />
              <text x={meio} y={144} textAnchor="middle" className="barras-rotulo">
                {m.rotulo}
              </text>
            </g>
          );
        })}
        <line x1={0} x2={LARGURA} y1={BASE} y2={BASE} className="barras-linha" />
      </svg>

      <div className="grafico-detalhe">
        <strong>{ativo.rotulo}</strong>
        <span className="positivo">Receitas {formatarMoeda(ativo.receitas)}</span>
        <span className="negativo">Despesas {formatarMoeda(ativo.despesas)}</span>
        <span>Saldo {formatarMoeda(ativo.receitas - ativo.despesas)}</span>
      </div>
    </section>
  );
}