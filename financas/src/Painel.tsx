
import { useState } from "react";
import { calcularSaldo, formatarMoeda } from "./utils/dinheiro";
import { useTransacoes } from "./hooks/useTransacoes";
import FormularioTransacao from "./components/FormularioTransacao";
import ResumoCategorias from "./components/ResumoCategorias";
import IconeCategoria from "./components/IconeCategoria";
import type { User } from "@supabase/supabase-js";
import Avatar from "./components/Avatar";
import NomeUsuario from "./components/NomeUsuario";
import { ABAS, type Aba } from "./utils/abas";
import PaginaTransacoes from "./components/PaginaTransacoes";
import PaginaConversor from "./components/PaginaConversor";
import PaginaInvestimentos from "./components/PaginaInvestimentos";
import PaginaRelatorios from "./components/PaginaRelatorios";
import SeletorMes from "./components/SeletorMes";
import CarrosselDicas from "./components/CarrosselDicas";
import PaginaAprender from "./components/PaginaAprender";
import PaginaParcelas from "./components/PaginaParcelas";
import BarraMobile from "./components/BarraMobile";
import Modal from "./components/Modal";
import { dataBR, mesAtual } from "./utils/datas";
import { useParcelamentos } from "./hooks/useParcelamentos";
import { parcelasComoTransacoes } from "./utils/parcelamentos";

type Props = {
  usuario: User;
  email: string;
  onSair: () => void; 
};

export default function Painel({ usuario, email, onSair }: Props) {
  const { transacoes, carregando, erro, adicionar, editar, remover } = useTransacoes();
  const parcelas = useParcelamentos();
  const [mes, setMes] = useState(mesAtual());
  const [aba, setAba] = useState<Aba>("visao");
  const [dicaAberta, setDicaAberta] = useState<string | null>(null);
  const [novaAberta, setNovaAberta] = useState(false);

  function abrirDica(id: string | null) {
    setDicaAberta(id);
    setAba("aprender");
  }

  // despesas do mês = transações + parcelas das compras parceladas que vencem no mês
  const todas = [...transacoes, ...parcelasComoTransacoes(parcelas.parcelamentos)];

  const doMes = todas
    .filter((t) => t.data.startsWith(mes))
    .sort((a, b) => b.data.localeCompare(a.data));

  const receitas = doMes
    .filter((t) => t.tipo === "receita")
    .reduce((soma, t) => soma + t.valorEmCentavos, 0);
  const despesas = doMes
    .filter((t) => t.tipo === "despesa")
    .reduce((soma, t) => soma + t.valorEmCentavos, 0);

  const saldo = calcularSaldo(doMes);

    return (
    <div className="shell">
      <aside className="sidebar">
        <div className="marca">
          <img className="login-icone" src="/logo-finflow.png" alt="" width={34} height={34} />
          <NomeUsuario usuario={usuario} />
        </div>

        <nav className="menu">
  {ABAS.map(({ id, nome, icone: Icone }) => (
    <button
      key={id}
      type="button"
      className={`menu-item ${aba === id ? "ativo" : ""}`}
      onClick={() => setAba(id)}
    >
      <Icone size={18} />
      {nome}
    </button>
  ))}
</nav>

        <div className="sidebar-rodape">
          <small>{email}</small>
          <Avatar usuario={usuario}/>
          <button className="btn-sair" onClick={onSair}>Sair</button>
        </div>
      </aside>

      <main className="conteudo">
        {aba === "visao" && (
        <>
        <header className="topo">
          <div>
            <h1>Dashboard</h1>
            <p className="subtitulo">Visão geral das suas finanças</p>
          </div>
          <SeletorMes rotulo="Mês" valor={mes} onChange={setMes} />
        </header>

        <section className="grade-topo">
          <div className="card card-destaque">
            <span className="rotulo">Saldo do mês</span>
            <strong className={`valor-grande ${saldo < 0 ? "negativo" : ""}`}>
              {formatarMoeda(saldo)}
            </strong>
          </div>
          <div className="card">
            <span className="rotulo">Receitas</span>
            <strong className="valor-grande positivo">{formatarMoeda(receitas)}</strong>
          </div>
          <div className="card">
            <span className="rotulo">Despesas</span>
            <strong className="valor-grande negativo">{formatarMoeda(despesas)}</strong>
          </div>
        </section>

        <CarrosselDicas onAbrir={abrirDica} />

        <section className="grade-meio">
          <FormularioTransacao onAdicionar={adicionar} />
          <div className="coluna-esquerda">
            <ResumoCategorias transacoes={doMes} />
          </div>
        </section>

        <section className="card">
          <h2>Transações recentes</h2>
          {erro && <p className="erro">{erro}</p>}
          {carregando ? (
            <p className="vazio">Carregando…</p>
          ) : doMes.length === 0 ? (
            <p className="vazio">Nenhuma transação neste mês.</p>
          ) : (
            <ul className="lista">
              {doMes.map((t) => (
                <li key={t.id} className="item">
                  <IconeCategoria categoria={t.categoria} />
                    <div className="item-info">
                      <strong>{t.descricao}</strong>
                      <small>{dataBR(t.data)} · {t.categoria}</small>
                  </div>
                  <span className={`item-valor ${t.tipo === "despesa" ? "negativo" : "positivo"}`}>
                    {t.tipo === "despesa" ? "-" : "+"}
                    {formatarMoeda(t.valorEmCentavos)}
                  </span>
                  {!t.id.startsWith("parc-") && (
                    <button className="btn-remover" onClick={() => remover(t.id)}>
                      Remover
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
        </>
        )}

         

        {aba === "transacoes" && <PaginaTransacoes transacoes={transacoes} onRemover={remover} onEditar={editar} />}

        {aba === "parcelas" && (
          <PaginaParcelas
            parcelamentos={parcelas.parcelamentos}
            carregando={parcelas.carregando}
            erro={parcelas.erro}
            onAdicionar={parcelas.adicionar}
            onEditar={parcelas.editar}
            onRemover={parcelas.remover}
          />
        )}

        {aba === "relatorios" && <PaginaRelatorios transacoes={todas} />}

        {aba === "investimentos" && <PaginaInvestimentos />}

        {aba === "conversor" && <PaginaConversor />}

        {aba === "aprender" && (
          <PaginaAprender key={dicaAberta ?? "todas"} abertaInicial={dicaAberta} />
        )}
      </main>

      <BarraMobile aba={aba} onAba={setAba} onNova={() => setNovaAberta(true)} />

      {novaAberta && (
        <Modal rotulo="Nova transação" onFechar={() => setNovaAberta(false)}>
          <FormularioTransacao
            onAdicionar={(dados) => {
              void adicionar(dados);
              setNovaAberta(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}