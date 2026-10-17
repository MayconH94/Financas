import { useState, type FormEvent, type CSSProperties } from "react";
import type { NovoInvestimento, TipoInvestimento } from "../types/investimento";
import { converterParaCentavos } from "../utils/dinheiro";
import { TIPOS, LISTA_TIPOS } from "../utils/tiposInvestimento";

type Props = { onAdicionar: (dados: NovoInvestimento) => Promise<void> };

const hoje = new Date().toLocaleDateString("en-CA"); // AAAA-MM-DD no horário local

export default function FormularioInvestimento({ onAdicionar }: Props) {
  const [tipo, setTipo] = useState<TipoInvestimento>("acao");
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [data, setData] = useState(hoje);
  const [quantidade, setQuantidade] = useState("");
  const [valorInvestido, setValorInvestido] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [erro, setErro] = useState("");

  const config = TIPOS[tipo];
  const temVencimento = tipo === "tesouro" || tipo === "renda_fixa";

  function aoEnviar(e: FormEvent) {
    e.preventDefault();
    setErro("");

    const nomeLimpo = nome.trim();
    const investido = converterParaCentavos(valorInvestido);
    const qtd = config.temCodigo ? Number(quantidade.replace(",", ".")) : 1;
    const atual = valorAtual.trim() === "" ? null : converterParaCentavos(valorAtual);

    if (!nomeLimpo) return setErro("Informe o nome do ativo.");
    if (config.temCodigo && !codigo.trim()) return setErro("Informe o código (ex.: PETR4).");
    if (!Number.isFinite(qtd) || qtd <= 0) return setErro("Informe uma quantidade maior que zero.");
    if (!data) return setErro("Informe a data da compra.");
    if (Number.isNaN(investido) || investido <= 0) return setErro("Informe um valor investido maior que zero.");
    if (atual !== null && (Number.isNaN(atual) || atual < 0)) return setErro("Valor atual inválido.");

    void onAdicionar({
      tipo,
      nome: nomeLimpo,
      codigo: config.temCodigo ? codigo.trim().toUpperCase() : null,
      dataCompra: data,
      quantidade: qtd,
      valorInvestidoEmCentavos: investido,
      valorAtualEmCentavos: config.temCodigo ? null : atual,
      vencimento: temVencimento && vencimento ? vencimento : null,
      observacao: null,
    });

    setNome("");
    setCodigo("");
    setQuantidade("");
    setValorInvestido("");
    setValorAtual("");
    setVencimento("");
  }

  return (
    <form className="card formulario" onSubmit={aoEnviar}>
      <h2 className="span-2">Novo investimento</h2>

      <div className="seletor-categorias tres">
        {LISTA_TIPOS.map((t) => {
          const { rotulo, icone: Icone, cor } = TIPOS[t];
          return (
            <button
              key={t}
              type="button"
              className={`chip-cat ${tipo === t ? "ativo" : ""}`}
              style={{ "--cor": cor } as CSSProperties}
              onClick={() => setTipo(t)}
            >
              <Icone size={18} />
              {rotulo}
            </button>
          );
        })}
      </div>

      <label className="campo span-2">
        Nome do ativo
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder={config.temCodigo ? "Ex.: Petrobras" : "Ex.: Tesouro Selic 2029"}
        />
      </label>

      {config.temCodigo && (
        <label className="campo">
          Código
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ex.: PETR4" />
        </label>
      )}

      {config.temCodigo && (
        <label className="campo">
          Quantidade
          <input
            inputMode="decimal"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="Ex.: 100"
          />
        </label>
      )}

      <label className="campo">
        Data da compra
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
      </label>

      <label className="campo">
        {config.temCodigo ? "Total pago (R$)" : "Valor aplicado (R$)"}
        <input
          inputMode="decimal"
          value={valorInvestido}
          onChange={(e) => setValorInvestido(e.target.value)}
          placeholder="Ex.: 1.500,00"
        />
      </label>

      {!config.temCodigo && (
        <label className="campo">
          Valor atual hoje (R$, opcional)
          <input
            inputMode="decimal"
            value={valorAtual}
            onChange={(e) => setValorAtual(e.target.value)}
            placeholder="Ex.: 1.620,00"
          />
        </label>
      )}

      {temVencimento && (
        <label className="campo">
          Vencimento
          <input type="date" value={vencimento} onChange={(e) => setVencimento(e.target.value)} />
        </label>
      )}

      <button type="submit" className="btn-primario span-2">Adicionar</button>
      {erro && <p className="erro span-2">{erro}</p>}
    </form>
  );
}