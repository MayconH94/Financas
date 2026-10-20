import { ChevronLeft, ChevronRight } from "lucide-react";
import { mesAtual } from "../utils/datas";

type Props = {
  valor: string; // AAAA-MM ("" = todos os meses)
  onChange: (novo: string) => void;
  rotulo?: string;
};


function deslocar(mes: string, delta: number) {
  const [a, m] = (mes || mesAtual()).split("-").map(Number);
  const d = new Date(a, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function nomeDoMes(mes: string) {
  if (!mes) return "Todos os meses";
  const [a, m] = mes.split("-").map(Number);
  const nome = new Date(a, m - 1, 1).toLocaleDateString("pt-BR", { month: "long" });
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)} de ${a}`;
}

export default function SeletorMes({ valor, onChange, rotulo }: Props) {
  return (
    <div className="seletor-mes">
      {rotulo && <span>{rotulo}</span>}
      <div className="mes-nav">
        <button type="button" onClick={() => onChange(deslocar(valor, -1))} aria-label="Mês anterior">
          <ChevronLeft size={18} />
        </button>
        <strong>{nomeDoMes(valor)}</strong>
        <button type="button" onClick={() => onChange(deslocar(valor, 1))} aria-label="Próximo mês">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
