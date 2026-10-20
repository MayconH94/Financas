import { useState } from "react";
import type { Transacao } from "../types/transacao";
import { LISTA_CATEGORIA, type Categoria } from "../utils/categorias";
import { dataBR } from "../utils/datas";
import { formatarMoeda } from "../utils/dinheiro";
import SeletorMes from "./SeletorMes";
import IconeCategoria from "./IconeCategoria";
import EditarTransacao from "./EditarTransacao";

type Props = {
  transacoes: Transacao[];
  onRemover: (id: string) => Promise<void>;
  onEditar: (id: string, dados: Omit<Transacao, "id">) => Promise<boolean>;
};

const POR_PAGINA = 50;

// "Alimentação" -> "alimentacao", para a busca ignorar acentos e maiúsculas
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function PaginaTransacoes({ transacoes, onRemover, onEditar }: Props) {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState<"todos" | "receita" | "despesa">("todos");
  const [categoria, setCategoria] = useState<Categoria | "todas">("todas");
  const [mes, setMes] = useState(""); // vazio = todos os meses
  const [limite, setLimite] = useState(POR_PAGINA);
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [editando, setEditando] = useState<Transacao | null>(null);

  const termo = normalizar(busca.trim());

  const filtradas = transacoes
    .filter(
      (t) =>
        (tipo === "todos" || t.tipo === tipo) &&
        (categoria === "todas" || t.categoria === categoria) &&
        (!mes || t.data.startsWith(mes)) &&
        (!termo || normalizar(t.descricao).includes(termo)),
    )
    .sort((a, b) => b.data.localeCompare(a.data));

  const receitas = filtradas
    .filter((t) => t.tipo === "receita")
    .reduce((soma, t) => soma + t.valorEmCentavos, 0);
  const despesas = filtradas
    .filter((t) => t.tipo === "despesa")
    .reduce((soma, t) => soma + t.valorEmCentavos, 0);

  const visiveis = filtradas.slice(0, limite);
  const filtrando = busca !== "" || tipo !== "todos" || categoria !== "todas" || mes !== "";

  function limpar() {
    setBusca("");
    setTipo("todos");
    setCategoria("todas");
    setMes("");
    setLimite(POR_PAGINA);
  }

  return (
    <div className="pagina-transacoes">
      <header className="topo">
        <div>
          <h1>Transações</h1>
          <p className="subtitulo">Todas as suas receitas e despesas</p>
        </div>
      </header>

      <section className="card">
        <div className="filtros">
          <input
            className="filtro-busca"
            type="search"
            placeholder="Buscar pela descrição"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setLimite(POR_PAGINA);
            }}
          />
          <select
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value as "todos" | "receita" | "despesa");
              setLimite(POR_PAGINA);
            }}
          >
            <option value="todos">Receitas e despesas</option>
            <option value="receita">Só receitas</option>
            <option value="despesa">Só despesas</option>
          </select>
          <select
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value as Categoria | "todas");
              setLimite(POR_PAGINA);
            }}
          >
            <option value="todas">Todas as categorias</option>
            {LISTA_CATEGORIA.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <SeletorMes
            valor={mes}
            onChange={(novo) => {
              setMes(novo);
              setLimite(POR_PAGINA);
            }}
          />
        </div>

        <div className="transacoes-resumo">
          <span>
            {filtradas.length} {filtradas.length === 1 ? "transação" : "transações"}
          </span>
          <span className="positivo">Receitas {formatarMoeda(receitas)}</span>
          <span className="negativo">Despesas {formatarMoeda(despesas)}</span>
          <span>Saldo {formatarMoeda(receitas - despesas)}</span>
          {filtrando && (
            <button type="button" className="btn-link" onClick={limpar}>
              Limpar filtros
            </button>
          )}
        </div>
      </section>

      <section className="card">
        {filtradas.length === 0 ? (
          <p className="vazio">
            {filtrando ? "Nenhuma transação com esses filtros." : "Nenhuma transação ainda."}
          </p>
        ) : (
          <ul className="lista">
            {visiveis.map((t) => (
              <li key={t.id} className="item item-transacao">
                <IconeCategoria categoria={t.categoria} />
                <div className="item-info">
                  <strong>{t.descricao}</strong>
                  <small>
                    {dataBR(t.data)} · {t.categoria}
                  </small>
                </div>
                <span className={`item-valor ${t.tipo === "despesa" ? "negativo" : "positivo"}`}>
                  {t.tipo === "despesa" ? "-" : "+"}
                  {formatarMoeda(t.valorEmCentavos)}
                </span>
                <div className="item-acoes">
                  {confirmando === t.id ? (
                    <>
                      <button
                        type="button"
                        className="btn-acao perigo"
                        onClick={() => {
                          setConfirmando(null);
                          void onRemover(t.id);
                        }}
                      >
                        Excluir
                      </button>
                      <button type="button" className="btn-acao" onClick={() => setConfirmando(null)}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="btn-acao" onClick={() => setEditando(t)}>
                        Editar
                      </button>
                      <button type="button" className="btn-acao" onClick={() => setConfirmando(t.id)}>
                        Remover
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {filtradas.length > limite && (
          <button type="button" className="btn-acao mais" onClick={() => setLimite(limite + POR_PAGINA)}>
            Mostrar mais ({filtradas.length - limite})
          </button>
        )}
      </section>

      {editando && (
        <EditarTransacao
          key={editando.id}
          transacao={editando}
          onSalvar={(dados) => onEditar(editando.id, dados)}
          onFechar={() => setEditando(null)}
        />
      )}
    </div>
  );
}
