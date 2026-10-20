import { useState } from "react";
import { Ellipsis, Plus } from "lucide-react";
import { ABAS, type Aba } from "../utils/abas";

type Props = {
  aba: Aba;
  onAba: (aba: Aba) => void;
  onNova: () => void; // abre o lançamento rápido de transação
};

// abas fixas na barra; as demais ficam no menu "Mais"
const ESQUERDA: Aba[] = ["visao", "transacoes"];
const DIREITA: Aba[] = ["parcelas"];
const MAIS: Aba[] = ABAS.map((a) => a.id).filter((id) => ![...ESQUERDA, ...DIREITA].includes(id));

export default function BarraMobile({ aba, onAba, onNova }: Props) {
  const [maisAberto, setMaisAberto] = useState(false);

  function ir(id: Aba) {
    onAba(id);
    setMaisAberto(false);
  }

  function botao(id: Aba, classe: string) {
    const { nome, icone: Icone } = ABAS.find((a) => a.id === id)!;
    return (
      <button key={id} type="button" className={`${classe} ${aba === id ? "ativo" : ""}`} onClick={() => ir(id)}>
        <Icone size={20} />
        <span>{nome}</span>
      </button>
    );
  }

  return (
    <>
      {maisAberto && (
        <div className="mais-fundo" onClick={() => setMaisAberto(false)}>
          <div className="mais-painel card" onClick={(e) => e.stopPropagation()}>
            {MAIS.map((id) => botao(id, "mais-item"))}
          </div>
        </div>
      )}

      <nav className="barra-mobile" aria-label="Navegação principal">
        {ESQUERDA.map((id) => botao(id, "barra-item"))}

        <button type="button" className="barra-nova" onClick={onNova} aria-label="Nova transação">
          <Plus size={26} />
        </button>

        {DIREITA.map((id) => botao(id, "barra-item"))}

        <button
          type="button"
          className={`barra-item ${MAIS.includes(aba) || maisAberto ? "ativo" : ""}`}
          onClick={() => setMaisAberto(!maisAberto)}
          aria-expanded={maisAberto}
        >
          <Ellipsis size={20} />
          <span>Mais</span>
        </button>
      </nav>
    </>
  );
}
