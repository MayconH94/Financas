import { useInvestimentos } from "../hooks/useInvestimento";
import { useCotacoes } from "../hooks/useCotacoes";
import { calcularPosicao } from "../utils/carteira";
import { formatarMoeda } from "../utils/dinheiro";
import FormularioInvestimento from "./FormularioInvestimento";
import ListaInvestimentos from "./ListaInvestimentos";

export default function PaginaInvestimentos() {
  const { investimentos, carregando, erro, adicionar, remover } = useInvestimentos();

  const cotacoes = useCotacoes(investimentos);

  const totalInvestido = investimentos.reduce((soma, i) => soma + i.valorInvestidoEmCentavos, 0);
  const totalResultado = investimentos.reduce(
    (soma, i) => soma + (calcularPosicao(i, cotacoes).resultadoEmCentavos ?? 0),
    0
  );
  const tiposDiferentes = new Set(investimentos.map((i) => i.tipo)).size;

  return (
    <>
      <div className="grade-topo">
        <div className="card card-destaque">
          <p className="rotulo">Total investido</p>
          <p className="valor-grande">{formatarMoeda(totalInvestido)}</p>
        </div>
        <div className="card">
          <p className="rotulo">Resultado</p>
          <p className={`valor-grande ${totalResultado >= 0 ? "positivo" : "negativo"}`}>
            {formatarMoeda(totalResultado)}
          </p>
        </div>
        <div className="card">
          <p className="rotulo">Tipos diferentes</p>
          <p className="valor-grande">{tiposDiferentes}</p>
        </div>
      </div>

      {erro && <p className="erro">{erro}</p>}

      <FormularioInvestimento onAdicionar={adicionar} />

      {carregando ? (
        <p className="vazio">Carregando…</p>
      ) : (
        <ListaInvestimentos investimentos={investimentos} cotacoes={cotacoes} onRemover={remover} />
      )}
    </>
  );
}