import { useState, type FormEvent } from "react";
import type { Transacao } from "../types/transacao";
import { converterParaCentavos } from "../utils/dinheiro";
import { LISTA_CATEGORIA, type Categoria } from "../utils/categorias";

type Dados = Omit<Transacao, "id">;

type Props = {
  transacao: Transacao;
  onSalvar: (dados: Dados) => Promise<boolean>;
  onFechar: () => void;
};

// 1990 -> "19,90"
const paraTexto = (centavos: number) => (centavos / 100).toFixed(2).replace(".", ",");

export default function EditarTransacao({ transacao, onSalvar, onFechar }: Props) {
  const [tipo, setTipo] = useState(transacao.tipo);
  const [descricao, setDescricao] = useState(transacao.descricao);
  const [valor, setValor] = useState(paraTexto(transacao.valorEmCentavos));
  const [data, setData] = useState(transacao.data);
  const [categoria, setCategoria] = useState<Categoria>(transacao.categoria);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const centavos = converterParaCentavos(valor);
    if (!descricao.trim() || Number.isNaN(centavos) || centavos <= 0 || !data) {
      setErro("Preencha a descrição, um valor maior que zero e a data.");
      return;
    }

    setSalvando(true);
    const ok = await onSalvar({
      descricao: descricao.trim(),
      valorEmCentavos: centavos,
      data,
      categoria,
      tipo,
    });
    setSalvando(false);

    if (ok) onFechar();
    else setErro("Não foi possível salvar. Tente de novo.");
  }

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <form
        className="modal card"
        onClick={(e) => e.stopPropagation()}
        onSubmit={aoEnviar}
        role="dialog"
        aria-modal="true"
        aria-label="Editar transação"
      >
        <h2>Editar transação</h2>

        <div className="modal-tipo">
          <button
            type="button"
            className={`btn-acao ${tipo === "despesa" ? "ativo-despesa" : ""}`}
            onClick={() => setTipo("despesa")}
          >
            Despesa
          </button>
          <button
            type="button"
            className={`btn-acao ${tipo === "receita" ? "ativo-receita" : ""}`}
            onClick={() => setTipo("receita")}
          >
            Receita
          </button>
        </div>

        <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <input
          placeholder="Valor (ex.: 38,95)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          inputMode="decimal"
        />
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}>
          {LISTA_CATEGORIA.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

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
    </div>
  );
}
