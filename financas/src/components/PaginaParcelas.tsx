import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { formatarMoeda } from "../utils/dinheiro";
import { dataBR, hojeISO } from "../utils/datas";
import {
  parcelasDoMes,
  resumir,
  valorDaParcela,
  type NovoParcelamento,
  type Parcelamento,
} from "../utils/parcelamentos";
import EditarParcelamento from "./EditarParcelamento";
import IconeCategoria from "./IconeCategoria";

type Props = {
  parcelamentos: Parcelamento[];
  carregando: boolean;
  erro: string;
  onAdicionar: (dados: NovoParcelamento) => Promise<void>;
  onEditar: (id: string, dados: NovoParcelamento) => Promise<boolean>;
  onRemover: (id: string) => Promise<void>;
  novaAberta: boolean;
  onAbrirNova: () => void;
  onFecharNova: () => void;
};

export default function PaginaParcelas({ parcelamentos, carregando, erro, onAdicionar, onEditar, onRemover, novaAberta, onAbrirNova, onFecharNova }: Props) {
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [editando, setEditando] = useState<Parcelamento | null>(null);

  const hoje = hojeISO();
  const resumos = parcelamentos.map((p) => ({ p, r: resumir(p, hoje) }));
  const ativos = resumos.filter(({ r }) => !r.quitado);
  const totalRestante = resumos.reduce((soma, { r }) => soma + r.valorRestante, 0);
  const doMes = parcelasDoMes(parcelamentos, hoje.slice(0, 7));

  return (
    <div className="pagina-parcelas">
      <header className="topo">
        <div>
          <h1>Parcelas</h1>
          <p className="subtitulo">Suas compras parceladas e o que falta pagar</p>
        </div>
        <button type="button" className="btn-primario btn-nova-parcela" onClick={onAbrirNova}>
          <Plus size={18} /> Nova compra
        </button>
      </header>

      <section className="cartao" aria-label="Resumo das parcelas">
        <div className="cartao-topo">
          <span>Finflow</span>
          <CreditCard size={22} />
        </div>
        <span className="cartao-chip" aria-hidden="true" />
        <div>
          <small>Total a pagar</small>
          <strong className="cartao-valor">{formatarMoeda(totalRestante)}</strong>
        </div>
        <div className="cartao-rodape">
          <div>
            <small>Parcelas deste mês</small>
            <b>{formatarMoeda(doMes)}</b>
          </div>
          <div>
            <small>Compras ativas</small>
            <b>{ativos.length}</b>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Compras parceladas</h2>
        {erro && <p className="erro">{erro}</p>}
        {carregando ? (
          <p className="vazio">Carregando…</p>
        ) : parcelamentos.length === 0 ? (
          <p className="vazio">Nenhuma compra parcelada ainda.</p>
        ) : (
          <ul className="lista">
            {resumos.map(({ p, r }) => (
              <li key={p.id} className="parcela-item">
                <div className="parcela-cab">
                  <IconeCategoria categoria={p.categoria} />
                  <div className="item-info">
                    <strong>{p.descricao}</strong>
                    <small>
                      {r.quitado
                        ? "Quitado"
                        : `${r.restantes} ${r.restantes === 1 ? "parcela restante" : "parcelas restantes"} de ${formatarMoeda(valorDaParcela(p, 0))}`}
                    </small>
                  </div>
                  <span className="parcela-restante">{formatarMoeda(r.valorRestante)}</span>
                </div>

                <div className="barra" aria-hidden="true">
                  <div className="barra-preenchida" style={{ width: `${(r.pagas / p.parcelas) * 100}%` }} />
                </div>

                <div className="parcela-rodape">
                  <small>
                    {r.pagas} de {p.parcelas} pagas
                    {r.proxima && ` · próxima em ${dataBR(r.proxima.data)}`}
                  </small>
                  {confirmando === p.id ? (
                    <span className="item-acoes">
                      <button
                        type="button"
                        className="btn-acao perigo"
                        onClick={() => {
                          setConfirmando(null);
                          void onRemover(p.id);
                        }}
                      >
                        Excluir
                      </button>
                      <button type="button" className="btn-acao" onClick={() => setConfirmando(null)}>
                        Cancelar
                      </button>
                    </span>
                  ) : (
                    <span className="item-acoes">
                      <button type="button" className="btn-acao" onClick={() => setEditando(p)}>
                        Editar
                      </button>
                      <button type="button" className="btn-acao" onClick={() => setConfirmando(p.id)}>
                        Remover
                      </button>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {novaAberta && (
        <EditarParcelamento
          onSalvar={async (dados) => {
            await onAdicionar(dados);
            return true;
          }}
          onFechar={onFecharNova}
        />
      )}

      {editando && (
        <EditarParcelamento
          key={editando.id}
          parcelamento={editando}
          onSalvar={(dados) => onEditar(editando.id, dados)}
          onFechar={() => setEditando(null)}
        />
      )}
    </div>
  );
}
