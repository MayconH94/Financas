import { useState } from "react";
import type { Transacao } from "../types/transacao";
import { formatarMoeda, converterParaCentavos } from "../utils/dinheiro";
import { CATEGORIAS_DESPESA } from "../utils/categorias";
import { despesasDoMes, totalDespesas, situacaoMeta } from "../utils/gastos";
import { useMetas } from "../hooks/useMetas";

type Props = { transacoes: Transacao[]; mes: string };

const TOTAL = "Total";
const ROTULO_SITUACAO = { ok: "Dentro da meta", atencao: "Quase no limite", estourou: "Meta estourada" };

export default function MetasGastos({ transacoes, mes }: Props) {
  const { metas, carregando, erro, salvar, remover } = useMetas();
  const [editando, setEditando] = useState<string | null>(null);
  const [valor, setValor] = useState("");
  const [erroForm, setErroForm] = useState("");

  const despesas = despesasDoMes(transacoes, mes);
  const gastoPor = (chave: string) =>
    chave === TOTAL
      ? totalDespesas(despesas)
      : totalDespesas(despesas.filter((t) => t.categoria === chave));

  function abrir(chave: string) {
    setEditando(chave);
    setValor(metas[chave] ? String(metas[chave].limiteEmCentavos / 100).replace(".", ",") : "");
    setErroForm("");
  }

  async function confirmar(chave: string) {
    const centavos = converterParaCentavos(valor);
    if (Number.isNaN(centavos) || centavos <= 0) {
      setErroForm("Informe um valor maior que zero.");
      return;
    }
    if (await salvar(chave, centavos)) setEditando(null);
  }

  return (
    <section className="card">
      <h2>Metas de gastos</h2>
      <p className="subtitulo">Defina um limite mensal e acompanhe quanto já foi usado.</p>
      {erro && <p className="erro">{erro}</p>}
      {carregando && <p className="vazio">Carregando…</p>}

      <ul className="metas">
        {[TOTAL, ...CATEGORIAS_DESPESA].map((chave) => {
          const meta = metas[chave];
          const gasto = gastoPor(chave);
          const situacao = meta ? situacaoMeta(gasto, meta.limiteEmCentavos) : null;
          const pct = meta ? Math.min(100, (gasto / meta.limiteEmCentavos) * 100) : 0;

          return (
            <li key={chave} className="meta">
              <div className="ranking-linha">
                <strong>{chave === TOTAL ? "Total do mês" : chave}</strong>
                <span>
                  {formatarMoeda(gasto)}
                  {meta && ` de ${formatarMoeda(meta.limiteEmCentavos)}`}
                </span>
              </div>

              {meta && (
                <>
                  <div className="barra">
                    <div className={`barra-preenchida meta-${situacao}`} style={{ width: `${pct}%` }} />
                  </div>
                  <small className={`meta-texto meta-${situacao}`}>
                    {ROTULO_SITUACAO[situacao!]} ·{" "}
                    {gasto > meta.limiteEmCentavos
                      ? `${formatarMoeda(gasto - meta.limiteEmCentavos)} acima`
                      : `restam ${formatarMoeda(meta.limiteEmCentavos - gasto)}`}
                  </small>
                </>
              )}

              {editando === chave ? (
                <div className="meta-edicao">
                  <input
                    placeholder="Limite mensal (ex.: 800,00)"
                    value={valor}
                    inputMode="decimal"
                    autoFocus
                    onChange={(e) => setValor(e.target.value)}
                  />
                  <button type="button" className="btn-acao" onClick={() => void confirmar(chave)}>
                    Salvar
                  </button>
                  <button type="button" className="btn-acao" onClick={() => setEditando(null)}>
                    Cancelar
                  </button>
                  {erroForm && <p className="erro">{erroForm}</p>}
                </div>
              ) : (
                <div className="meta-acoes">
                  <button type="button" className="btn-acao" onClick={() => abrir(chave)}>
                    {meta ? "Editar meta" : "Definir meta"}
                  </button>
                  {meta && (
                    <button type="button" className="btn-remover" onClick={() => void remover(chave)}>
                      Remover
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
