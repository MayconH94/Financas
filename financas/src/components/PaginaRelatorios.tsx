import { useState } from "react";
import type { Transacao } from "../types/transacao";
import SeletorMes from "./SeletorMes";
import ConsumoSeisMeses from "./ConsumoSeisMeses";

type Props = { transacoes: Transacao[] };

export default function PaginaRelatorios({ transacoes }: Props) {
  const [mes, setMes] = useState(() => new Date().toLocaleDateString("sv-SE").slice(0, 7)); // AAAA-MM

  return (
    <div className="relatorios">
      <header className="topo">
        <div>
          <h1>Relatórios</h1>
          <p className="subtitulo">Análise das suas despesas</p>
        </div>
        <SeletorMes rotulo="Até o mês" valor={mes} onChange={setMes} />
      </header>

      <ConsumoSeisMeses transacoes={transacoes} mesFinal={mes} />
    </div>
  );
}
