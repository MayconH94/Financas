import { useEffect, useState } from "react";

export default function AvisoAtualizacao() {
  const [novo, setNovo] = useState(false);

  useEffect(() => {
    const ouvir = () => setNovo(true);
    window.addEventListener("pwa-atualizacao", ouvir);
    return () => window.removeEventListener("pwa-atualizacao", ouvir);
  }, []);

  if (!novo) return null;

  return (
    <div className="aviso-atualizacao" role="status">
      <span>Nova versão disponível</span>
      <button type="button" onClick={() => window.location.reload()}>
        Atualizar
      </button>
      <button type="button" className="fechar" onClick={() => setNovo(false)} aria-label="Depois">
        ✕
      </button>
    </div>
  );
}
