type Props = { size?: number | string; className?: string };

// ícone da aba Visão geral: quadro com barras e linha de tendência
export default function IconeVisaoGeral({ size = 24, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M7 16.5v-2.5M9.8 16.5v-4.5M12.6 16.5v-6.5" />
      <path d="M14.6 13.2l1.7-1.3 1.3.9 2-2" />
    </svg>
  );
}
