import { useEffect, useState } from "react";
import { aplicarAtualizacao } from "../utils/pwa";

export default function AvisoAtualizacao() {
  const [novo, setNovo] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    const ouvir = (e: Event) => setNovo((e as CustomEvent<ServiceWorker>).detail);
    window.addEventListener("pwa-atualizacao", ouvir);
    return () => window.removeEventListener("pwa-atualizacao", ouvir);
  }, []);

  if (!novo) return null;

  return (
    <div className="aviso-atualizacao" role="status">
      <span>Nova versão disponível</span>
      <button type="button" onClick={() => aplicarAtualizacao(novo)}>
        Atualizar
      </button>
      <button type="button" className="fechar" onClick={() => setNovo(null)} aria-label="Depois">
        ✕
      </button>
    </div>
  );
}
