import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { AVISO, DICAS } from "../utils/dicas";

type Props = { abertaInicial: string | null };

export default function PaginaAprender({ abertaInicial }: Props) {
  const [aberta, setAberta] = useState<string | null>(abertaInicial);

  return (
    <div className="aprender">
      <div>
        <h1>Aprender</h1>
        <p className="aprender-aviso">{AVISO}</p>
      </div>

      {DICAS.map((d) => {
        const Icone = d.icone;
        const aberto = aberta === d.id;
        return (
          <article key={d.id} className="aprender-item">
            <button
              type="button"
              className="aprender-cab"
              onClick={() => setAberta(aberto ? null : d.id)}
              aria-expanded={aberto}
            >
              <Icone size={20} />
              <span className="aprender-titulo">
                <strong>{d.titulo}</strong>
                <small>{d.resumo}</small>
              </span>
              <span className="aprender-nivel">{d.nivel}</span>
              <ChevronDown size={18} style={{ transform: aberto ? "rotate(180deg)" : "none" }} />
            </button>

            {aberto && (
              <div className="aprender-corpo">
                <ul>
                  {d.passos.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <a href={d.link.url} target="_blank" rel="noreferrer">
                  {d.link.rotulo} <ExternalLink size={14} />
                </a>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}