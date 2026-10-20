import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

// o navegador (Chrome/Edge) entrega este evento quando o app pode ser instalado
type EventoInstalar = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const CHAVE = "finflow-instalar-dispensado";

function jaInstalado(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return window.matchMedia("(display-mode: standalone)").matches || iosStandalone;
}

function foiDispensado(): boolean {
  try {
    return localStorage.getItem(CHAVE) === "1";
  } catch {
    return false;
  }
}

const ehIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

export default function InstalarApp() {
  const [evento, setEvento] = useState<EventoInstalar | null>(null);
  const [oculto, setOculto] = useState(() => jaInstalado() || foiDispensado());

  useEffect(() => {
    const ouvir = (e: Event) => {
      e.preventDefault(); // troca o aviso do navegador pelo nosso
      setEvento(e as EventoInstalar);
    };
    const aoInstalar = () => setOculto(true);

    window.addEventListener("beforeinstallprompt", ouvir);
    window.addEventListener("appinstalled", aoInstalar);
    return () => {
      window.removeEventListener("beforeinstallprompt", ouvir);
      window.removeEventListener("appinstalled", aoInstalar);
    };
  }, []);

  const ios = ehIOS();
  if (oculto || (!evento && !ios)) return null;

  function dispensar() {
    setOculto(true);
    try {
      localStorage.setItem(CHAVE, "1");
    } catch {
      // sem armazenamento: o aviso volta na próxima visita
    }
  }

  async function instalar() {
    if (!evento) return;
    await evento.prompt();
    const { outcome } = await evento.userChoice;
    if (outcome === "accepted") setOculto(true);
    setEvento(null);
  }

  return (
    <div className="aviso-instalar" role="status">
      <Download size={20} />
      <span>
        {evento
          ? "Instale o Finflow no seu aparelho"
          : "Para instalar: toque em Compartilhar e depois em “Adicionar à Tela de Início”."}
      </span>
      {evento && (
        <button type="button" onClick={() => void instalar()}>
          Instalar
        </button>
      )}
      <button type="button" className="fechar" onClick={dispensar} aria-label="Dispensar">
        <X size={18} />
      </button>
    </div>
  );
}
