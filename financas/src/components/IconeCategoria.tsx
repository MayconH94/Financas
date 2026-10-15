import { CATEGORIA, type Categoria } from "../utils/categorias";

type Props = {
  categoria: Categoria;
  tamanho?: number;
};

export default function IconeCategoria({ categoria, tamanho = 18 }: Props) {
  const { icone: Icone, cor } = CATEGORIA[categoria];
  const caixa = tamanho + 18;

  return (
    <span
      className="icone-cat"
      style={{ width: caixa, height: caixa, color: cor, background: `${cor}22` }}
    >
      <Icone size={tamanho} />
    </span>
  );
}

