import { useState, type FormEvent } from "react";
import { CreditCard } from "lucide-react";
import { converterParaCentavos, formatarMoeda } from "../utils/dinheiro";
import { LISTA_CATEGORIA, type Categoria } from "../utils/categorias";
import {
  hojeISO,
  parcelasDoMes,
  resumir,
  valorDaParcela,
  type NovoParcelamento,
  type Parcelamento,
} from "../utils/parcelamentos";
import IconeCategoria from "./IconeCategoria";

type Props = {
  parcelamentos: Parcelamento[];
  carregando: boolean;
  erro: string;
  onAdicionar: (dados: NovoParcelamento) => Promise<void>;
  onRemover: (id: string) => Promise<void>;
};

const dataBR = (iso: string) => iso.split("-").reverse().join("/");

export default function PaginaParcelas({ parcelamentos, carregando, erro, onAdicionar, onRemover }: Props) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [parcelas, setParcelas] = useState("12");
  const [primeira, setPrimeira] = useState(hojeISO());
  const [categoria, setCategoria] = useState<Categoria>("Outros");
  const [erroForm, setErroForm] = useState("");
  const [confirmando, setConfirmando] = useState<string | null>(null);

  const hoje = hojeISO();
  const resumos = parcelamentos.map((p) => ({ p, r: resumir(p, hoje) }));
  const ativos = resumos.filter(({ r }) => !r.quitado);
  const totalRestante = resumos.reduce((soma, { r }) => soma + r.valorRestante, 0);
  const doMes = parcelasDoMes(parcelamentos, hoje.slice(0, 7));

  // prévia: "12 × R$ 100,00"
  const totalCentavos = converterParaCentavos(valor);
  const qtd = Number(parcelas);
  const previa =
    Number.isFinite(totalCentavos) && totalCentavos > 0 && Number.isInteger(qtd) && qtd >= 1
      ? `${qtd} × ${formatarMoeda(Math.floor(totalCentavos / qtd))}`
      : "";

  function aoEnviar(e: FormEvent) {
    e.preventDefault();
    setErroForm("");

    if (!descricao.trim()) return setErroForm("Informe o que foi comprado.");
    if (Number.isNaN(totalCentavos) || totalCentavos <= 0) return setErroForm("Informe o valor total da compra.");
    if (!Number.isInteger(qtd) || qtd < 1 || qtd > 60) return setErroForm("Parcelas: de 1 a 60.");
    if (!primeira) return setErroForm("Informe o vencimento da primeira parcela.");

    void onAdicionar({
      descricao: descricao.trim(),
      valorTotalEmCentavos: totalCentavos,
      parcelas: qtd,
      primeiraParcela: primeira,
      categoria,
    });

    setDescricao("");
    setValor("");
    setParcelas("12");
    setCategoria("Outros");
  }

  return (
    <div className="pagina-parcelas">
      <header className="topo">
        <div>
          <h1>Parcelas</h1>
          <p className="subtitulo">Suas compras parceladas e o que falta pagar</p>
        </div>
      </header>

      <section className="cartao" aria-label="Resumo das parcelas">
        <div className="cartao-topo">
          <span>Finflow</span>
          <CreditCard size={22} />
        </div>
        <span className="cartao-chip" aria-hidden="true" />
        <div>
          <small>Total a pagar</small>
          <strong className="cartao-valor">{formatarMoeda(totalRestante)}</strong>
        </div>
        <div className="cartao-rodape">
          <div>
            <small>Parcelas deste mês</small>
            <b>{formatarMoeda(doMes)}</b>
          </div>
          <div>
            <small>Compras ativas</small>
            <b>{ativos.length}</b>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Compras parceladas</h2>
        {erro && <p className="erro">{erro}</p>}
        {carregando ? (
          <p className="vazio">Carregando…</p>
        ) : parcelamentos.length === 0 ? (
          <p className="vazio">Nenhuma compra parcelada ainda.</p>
        ) : (
          <ul className="lista">
            {resumos.map(({ p, r }) => (
              <li key={p.id} className="parcela-item">
                <div className="parcela-cab">
                  <IconeCategoria categoria={p.categoria} />
                  <div className="item-info">
                    <strong>{p.descricao}</strong>
                    <small>
                      {r.quitado
                        ? "Quitado"
                        : `${r.restantes} ${r.restantes === 1 ? "parcela restante" : "parcelas restantes"} de ${formatarMoeda(valorDaParcela(p, 0))}`}
                    </small>
                  </div>
                  <span className="parcela-restante">{formatarMoeda(r.valorRestante)}</span>
                </div>

                <div className="barra" aria-hidden="true">
                  <div className="barra-preenchida" style={{ width: `${(r.pagas / p.parcelas) * 100}%` }} />
                </div>

                <div className="parcela-rodape">
                  <small>
                    {r.pagas} de {p.parcelas} pagas
                    {r.proxima && ` · próxima em ${dataBR(r.proxima.data)}`}
                  </small>
                  {confirmando === p.id ? (
                    <span className="item-acoes">
                      <button
                        type="button"
                        className="btn-acao perigo"
                        onClick={() => {
                          setConfirmando(null);
                          void onRemover(p.id);
                        }}
                      >
                        Excluir
                      </button>
                      <button type="button" className="btn-acao" onClick={() => setConfirmando(null)}>
                        Cancelar
                      </button>
                    </span>
                  ) : (
                    <button type="button" className="btn-acao" onClick={() => setConfirmando(p.id)}>
                      Remover
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form className="card formulario" onSubmit={aoEnviar}>
        <h2>Nova compra parcelada</h2>
        <input placeholder="O que foi comprado" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <input
          placeholder="Valor total (ex.: 1.200,00)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          inputMode="decimal"
        />
        <input
          type="number"
          min={1}
          max={60}
          placeholder="Parcelas"
          value={parcelas}
          onChange={(e) => setParcelas(e.target.value)}
        />
        <input type="date" value={primeira} onChange={(e) => setPrimeira(e.target.value)} aria-label="Primeira parcela" />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}>
          {LISTA_CATEGORIA.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {previa && <p className="campo-largo parcela-previa">{previa}</p>}
        <button type="submit" className="btn-primario">
          Adicionar
        </button>
        {erroForm && <p className="erro">{erroForm}</p>}
      </form>
    </div>
  );
}
