import { useInvestimentos } from "../hooks/useInvestimento";
import { formatarMoeda } from "../utils/dinheiro";
import FormularioInvestimento from "./FormularioInvestimento";
import ListaInvestimentos from "./ListaInvestimentos";

export default function PaginaInvestimentos() {
  const { investimentos, carregando, erro, adicionar, remover } = useInvestimentos();

  const totalInvestido = investimentos.reduce((soma, i) => soma + i.valorInvestidoEmCentavos, 0);
  const tiposDiferentes = new Set(investimentos.map((i) => i.tipo)).size;

  return (
    <>
      <div className="grade-topo">
        <div className="card card-destaque">
          <p className="rotulo">Total investido</p>
          <p className="valor-grande">{formatarMoeda(totalInvestido)}</p>
        </div>
        <div className="card">
          <p className="rotulo">Ativos na carteira</p>
          <p className="valor-grande">{investimentos.length}</p>
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
        <ListaInvestimentos investimentos={investimentos} onRemover={remover} />
      )}
    </>
  );
}