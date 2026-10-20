import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  autoComplete: "current-password" | "new-password";
  placeholder?: string;
  dica?: string; // texto pequeno abaixo do campo
};

// Campo de senha com botão de mostrar/ocultar
export default function CampoSenha({ rotulo, valor, onChange, autoComplete, placeholder, dica }: Props) {
  const [visivel, setVisivel] = useState(false);

  return (
    <label className="login-campo">
      {rotulo}
      <span className="login-senha">
        <input
          type={visivel ? "text" : "password"}
          placeholder={placeholder}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          minLength={6}
          required
        />
        <button
          type="button"
          onClick={() => setVisivel(!visivel)}
          aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        >
          {visivel ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
      {dica && <small>{dica}</small>}
    </label>
  );
}
