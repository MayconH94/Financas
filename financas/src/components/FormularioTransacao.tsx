import { useState, type FormEvent } from "react";
import type { Transacao } from "../types/transacao";
import { converterParaCentavos } from "../utils/dinheiro";

type Categoria = Transacao["categoria"];
type NovaTransacao = Omit<Transacao, "id">;

const CATEGORIAS: Categoria[] = [
  "Salário", "Moradia", "Alimentação", "Transporte", "Lazer", "Saúde", "Educação", "Outros",
];

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
      <select value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}>
        {CATEGORIAS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select value={tipo} onChange={(e) => setTipo(e.target.value as "receita" | "despesa")}>
        <option value="despesa">Despesa</option>
        <option value="receita">Receita</option>
      </select>
      <button type="submit">Adicionar</button>
      {erro && <p style={{ color: "crimson" }}>{erro}</p>}
    </form>
  );
}