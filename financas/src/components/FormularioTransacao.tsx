import { useState, type FormEvent, type CSSProperties } from "react";
import type { Transacao } from "../types/transacao";
import { converterParaCentavos } from "../utils/dinheiro";
import { CATEGORIA, LISTA_CATEGORIA, type Categoria } from "../utils/categorias";

type NovaTransacao = Omit<Transacao, "id">;

type Props = {
  onAdicionar: (dados: NovaTransacao) => void;
};

const hoje = () => new Date().toLocaleDateString("sv-SE"); // AAAA-MM-DD no fuso local

export default function FormularioTransacao({ onAdicionar }: Props) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(hoje());
  const [categoria, setCategoria] = useState<Categoria>("Outros");
  const [tipo, setTipo] = useState<"receita" | "despesa">("despesa");
  const [erro, setErro] = useState("");

  function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const centavos = converterParaCentavos(valor);
    if (!descricao.trim() || Number.isNaN(centavos) || centavos <= 0) {
      setErro("Preencha a descrição e um valor maior que zero.");
      return;
    }

    onAdicionar({
      descricao: descricao.trim(),
      valorEmCentavos: centavos,
      data,
      categoria,
      tipo,
    });

    setDescricao("");
    setValor("");
    setCategoria("Outros");
    setErro("");
  }

  return (

    <form className="card formulario" onSubmit={aoEnviar}>
        <h2>Nova transacao</h2>
      <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      <input placeholder="Valor (ex.: 38,95)" value={valor} onChange={(e) => setValor(e.target.value)} inputMode="decimal" />
      <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
      <div className="seletor-categorias">
      {LISTA_CATEGORIA.map((c) => {
    const { icone: Icone, cor } = CATEGORIA[c];
      return (
      <button
        type="button"
        key={c}
        className={`chip-cat ${categoria === c ? "ativo" : ""}`}
        style={{ "--cor": cor } as CSSProperties}
        onClick={() => setCategoria(c)}
     >
        <Icone size={18}/>
        <span>{c}</span>
      </button>
    );
  })}
</div>
      <select value={tipo} onChange={(e) => setTipo(e.target.value as "receita" | "despesa")}>
        <option value="despesa">Despesa</option>
        <option value="receita">Receita</option>
      </select>
      <button type="submit" className="btn-primario">Adicionar</button>
      {erro && <p className="erro">{erro}</p>}
    </form>
  );
};