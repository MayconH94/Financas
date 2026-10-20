import { useEffect, type ReactNode } from "react";

type Props = {
  rotulo: string; // nome da janela, para leitores de tela
  onFechar: () => void;
  children: ReactNode;
};

// Janela por cima da página. Fecha ao tocar fora ou apertar Esc.
export default function Modal({ rotulo, onFechar, children }: Props) {
  useEffect(() => {
    const aoTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    document.addEventListener("keydown", aoTecla);
    return () => document.removeEventListener("keydown", aoTecla);
  }, [onFechar]);

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div
        className="modal card"
        role="dialog"
        aria-modal="true"
        aria-label={rotulo}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
