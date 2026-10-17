import type { Investimento } from "../types/investimento";
import { formatarMoeda } from "../utils/dinheiro";
import { TIPOS } from "../utils/tiposInvestimento";

type Props = {
  investimentos: Investimento[];
  onRemover: (id: string) => Promise<void>;
};

function dataBR(iso: string) {
  return iso.split("-").reverse().join("/");
}

export default function ListaInvestimentos({ investimentos, onRemover }: Props) {
  return (
    <section className="card">
      <h2>Minha carteira</h2>

      {investimentos.length === 0 ? (
        <p className="vazio">Nenhum investimento cadastrado.</p>
      ) : (
        <ul className="lista">
          {investimentos.map((i) => {
            const { rotulo, icone: Icone, cor } = TIPOS[i.tipo];
            return (
              <li key={i.id} className="item item-investimento">
                <span
                  className="icone-cat"
                  style={{ width: 36, height: 36, color: cor, background: `${cor}22` }}
                >
                  <Icone size={18} />
                </span>

                <div className="item-info">
                  <strong>
                    {i.nome}
                    {i.codigo ? ` · ${i.codigo}` : ""}
                  </strong>
                  <small>
                    {rotulo} · compra em {dataBR(i.dataCompra)}
                    {i.codigo ? ` · ${i.quantidade.toLocaleString("pt-BR", { maximumFractionDigits: 8 })} un.` : ""}
                    {i.vencimento ? ` · vence em ${dataBR(i.vencimento)}` : ""}
                  </small>
                </div>

                <div className="item-valores">
                  <strong>{formatarMoeda(i.valorInvestidoEmCentavos)}</strong>
                  {i.valorAtualEmCentavos !== null && (
                    <small>hoje {formatarMoeda(i.valorAtualEmCentavos)}</small>
                  )}
                </div>

                <button type="button" className="btn-remover" onClick={() => void onRemover(i.id)}>
                  Remover
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}