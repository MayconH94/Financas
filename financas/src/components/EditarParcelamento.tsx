import { useState, type FormEvent } from "react";
import { converterParaCentavos, formatarMoeda } from "../utils/dinheiro";
import { CATEGORIAS_DESPESA, type Categoria } from "../utils/categorias";
import type { NovoParcelamento, Parcelamento } from "../utils/parcelamentos";
import Modal from "./Modal";

type Props = {
  parcelamento: Parcelamento;
  onSalvar: (dados: NovoParcelamento) => Promise<boolean>;
  onFechar: () => void;
};

const paraTexto = (centavos: number) => (centavos / 100).toFixed(2).replace(".", ",");

export default function EditarParcelamento({ parcelamento, onSalvar, onFechar }: Props) {
  const [descricao, setDescricao] = useState(parcelamento.descricao);
  const [valor, setValor] = useState(paraTexto(parcelamento.valorTotalEmCentavos));
  const [parcelas, setParcelas] = useState(String(parcelamento.parcelas));
  const [primeira, setPrimeira] = useState(parcelamento.primeiraParcela);
  const [categoria, setCategoria] = useState<Categoria>(parcelamento.categoria);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const totalCentavos = converterParaCentavos(valor);
  const qtd = Number(parcelas);
  const valido = Number.isFinite(totalCentavos) && totalCentavos > 0 && Number.isInteger(qtd) && qtd >= 1;

  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!descricao.trim()) return setErro("Informe o que foi comprado.");
    if (!valido || qtd > 60) return setErro("Confira o valor total e as parcelas (de 1 a 60).");
    if (!primeira) return setErro("Informe o vencimento da primeira parcela.");

    setSalvando(true);
    const ok = await onSalvar({
      descricao: descricao.trim(),
      valorTotalEmCentavos: totalCentavos,
      parcelas: qtd,
      primeiraParcela: primeira,
      categoria,
    });
    setSalvando(false);

    if (ok) onFechar();
    else setErro("Não foi possível salvar. Tente de novo.");
  }

  return (
    <Modal rotulo="Editar compra parcelada" onFechar={onFechar}>
      <form onSubmit={aoEnviar}>
        <h2>Editar compra parcelada</h2>

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
          {CATEGORIAS_DESPESA.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {valido && <p className="parcela-previa">{`${qtd} × ${formatarMoeda(Math.floor(totalCentavos / qtd))}`}</p>}
        {erro && <p className="erro">{erro}</p>}

        <div className="modal-acoes">
          <button type="button" className="btn-acao" onClick={onFechar}>
            Cancelar
          </button>
          <button type="submit" className="btn-primario" disabled={salvando}>
            {salvando ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
