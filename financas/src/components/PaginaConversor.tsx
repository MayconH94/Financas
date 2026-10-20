import { useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { useMoedas } from "../hooks/useMoedas";
import { dataBR } from "../utils/datas";
import { NOMES_MOEDAS, ORDEM_MOEDAS, converter, formatarValor, lerNumero } from "../utils/moedas";

export default function PaginaConversor() {
  const { cambio, falhou, carregando } = useMoedas();
  const [texto, setTexto] = useState("1");
  const [de, setDe] = useState("USD");
  const [para, setPara] = useState("BRL");

  const moedas = cambio ? ORDEM_MOEDAS.filter((m) => cambio.taxas[m] !== undefined) : [];
  const valor = lerNumero(texto);
  const resultado =
    cambio && valor !== null && cambio.taxas[de] && cambio.taxas[para]
      ? converter(valor, de, para, cambio.taxas)
      : null;

  function inverter() {
    setDe(para);
    setPara(de);
  }

  return (
    <div className="conversor">
      <header className="topo">
        <div>
          <h1>Conversor de moedas</h1>
          <p className="subtitulo">Converta valores entre o real e outras moedas</p>
        </div>
      </header>

      {carregando && <p className="vazio">Carregando as taxas…</p>}

      {falhou && (
        <p className="erro">
          Não foi possível carregar as taxas agora. No computador (npm run dev) esta função não roda:
          ela só funciona no site publicado.
        </p>
      )}

      {cambio && (
        <>
          <section className="card conversor-card">
            <label className="campo">
              Valor
              <input
                inputMode="decimal"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Ex.: 100,00"
              />
            </label>

            <div className="conversor-moedas">
              <label className="campo">
                De
                <select value={de} onChange={(e) => setDe(e.target.value)}>
                  {moedas.map((m) => (
                    <option key={m} value={m}>
                      {m} · {NOMES_MOEDAS[m]}
                    </option>
                  ))}
                </select>
              </label>

              <button type="button" className="conversor-inverter" onClick={inverter} aria-label="Inverter moedas">
                <ArrowDownUp size={18} />
              </button>

              <label className="campo">
                Para
                <select value={para} onChange={(e) => setPara(e.target.value)}>
                  {moedas.map((m) => (
                    <option key={m} value={m}>
                      {m} · {NOMES_MOEDAS[m]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="conversor-resultado">
              {resultado !== null && valor !== null ? (
                <>
                  <small>
                    {formatarValor(valor, de)} equivalem a
                  </small>
                  <strong>{formatarValor(resultado, para)}</strong>
                  <small>
                    1 {de} = {formatarValor(converter(1, de, para, cambio.taxas), para)}
                  </small>
                </>
              ) : (
                <small>Digite um valor válido para converter.</small>
              )}
            </div>

            <p className="conversor-fonte">
              {cambio.data ? `Taxas de ${dataBR(cambio.data)} · ` : ""}
              Fonte: Frankfurter (dados do Banco Central Europeu), atualizadas uma vez por dia. Valores de
              referência, sem as taxas de bancos e casas de câmbio.
            </p>
          </section>

          <section className="card">
            <h2>Em reais hoje</h2>
            <ul className="lista">
              {moedas
                .filter((m) => m !== "BRL")
                .map((m) => (
                  <li key={m} className="item">
                    <div className="item-info">
                      <strong>{m}</strong>
                      <small>{NOMES_MOEDAS[m]}</small>
                    </div>
                    <span className="item-valor">1 {m} = {formatarValor(converter(1, m, "BRL", cambio.taxas), "BRL")}</span>
                  </li>
                ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
