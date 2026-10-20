import { useState, type FormEvent, type CSSProperties } from "react";
import type { Transacao, TipoTransacao } from "../types/transacao";
import { converterParaCentavos } from "../utils/dinheiro";
import { hojeISO } from "../utils/datas";
import { CATEGORIA, categoriasDoTipo, type Categoria } from "../utils/categorias";

type NovaTransacao = Omit<Transacao, "id">;

type Props = {
  onAdicionar: (dados: NovaTransacao) => void;
};

export default function FormularioTransacao({ onAdicionar }: Props) {
  const [tipo, setTipo] = useState<TipoTransacao>("despesa");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(hojeISO());
  const [categoria, setCategoria] = useState<Categoria>("Outros");
  const [erro, setErro] = useState("");

  // ao trocar o tipo, a categoria volta para "Outros" (serve para os dois)
  function escolherTipo(novo: TipoTransacao) {
    setTipo(novo);
    setCategoria("Outros");
  }

  function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const centavos = converterParaCentavos(valor);
    if (!descricao.trim() || Number.isNaN(centavos) || centavos <= 0) {
      setErro("Preencha a descrição e um valor maior que zero.");
      return;
    }

    onAdicionar({ descricao: descricao.trim(), valorEmCentavos: centavos, data, categoria, tipo });

    setDescricao("");
    setValor("");
    setCategoria("Outros");
    setErro("");
  }

  return (
    <form className="card formulario" onSubmit={aoEnviar}>
      <h2>Nova transação</h2>

      <div className="seletor-tipo campo-largo">
        <button
          type="button"
          className={`btn-acao ${tipo === "despesa" ? "ativo-despesa" : ""}`}
          onClick={() => escolherTipo("despesa")}
        >
          Despesa
        </button>
        <button
          type="button"
          className={`btn-acao ${tipo === "receita" ? "ativo-receita" : ""}`}
          onClick={() => escolherTipo("receita")}
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

      <div className="seletor-categorias">
        {categoriasDoTipo(tipo).map((c) => {
          const { icone: Icone, cor } = CATEGORIA[c];
          return (
            <button
              type="button"
              key={c}
              className={`chip-cat ${categoria === c ? "ativo" : ""}`}
              style={{ "--cor": cor } as CSSProperties}
              onClick={() => setCategoria(c)}
            >
              <Icone size={18} />
              <span>{c}</span>
            </button>
          );
        })}
      </div>

      <button type="submit" className="btn-primario">
        Adicionar
      </button>
      {erro && <p className="erro">{erro}</p>}
    </form>
  );
}
