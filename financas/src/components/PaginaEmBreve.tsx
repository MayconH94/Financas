type Props = { titulo: string; descricao: string};

export default function PaginaEmBreve({ titulo, descricao}: Props) {
    return (
        <section className="card">
            <h2>{titulo}</h2>
            <p className="vazio">{descricao}</p>
        </section>
    )
}