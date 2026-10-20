import { DICAS_DA_SEMANA } from "../utils/dicas";

type Props = {onAbrir :(id: string | null ) => void};

export default function CarrosselDicas({ onAbrir }: Props) {
    return (
        <section className="dicas-card">
            <div className="dicas-topo">
                <h2>Dicas de investimento da semana</h2>
                <button type="button" className="btn-link" onClick={() => onAbrir(null)}>Ver todas</button>
            </div>


            <div className="dicas-trilho">
        {DICAS_DA_SEMANA.map((d) => {
          const Icone = d.icone;
          return (
            <button key={d.id} type="button" className="dica-chip" onClick={() => onAbrir(d.id)}>
              <Icone size={20} />
              <span>
                <strong>{d.titulo}</strong>
                <small>{d.resumo}</small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}