import {useRef, useState, type ChangeEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type Props = {usuario: User};

// Recorta no centro, deixa quadrada (512 px no máximo) e salva como JPEG leve.
async function reduzirImagem(arquivo: File, lado = 512): Promise<Blob> {
    const imagem = await createImageBitmap(arquivo, { imageOrientation: "from-image" });
    const menor = Math.min(imagem.width, imagem.height);
    const x = (imagem.width - menor) / 2;
    const y = (imagem.height - menor) / 2;
    const tamanho = Math.min(lado, menor);

    const canvas = document.createElement("canvas");
    canvas.width = tamanho;
    canvas.height = tamanho;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas indisponível");
    ctx.fillStyle = "#0b1224"; // fundo para PNGs com transparência
    ctx.fillRect(0, 0, tamanho, tamanho);
    ctx.drawImage(imagem, x, y, menor, menor, 0, 0, tamanho, tamanho);
    imagem.close();

    return new Promise((resolver, falhar) => {
        canvas.toBlob((blob) => (blob ? resolver(blob) : falhar(new Error("falha ao converter"))), "image/jpeg", 0.85);
    });
}

export default function Avatar({ usuario }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [url, setUrl] = useState<string | null>(usuario.user_metadata?.avatar_url ?? null);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");
    const inicial = (usuario.email ?? "?")[0].toUpperCase();

    async function aoEscolher(e: ChangeEvent<HTMLInputElement>) {
        const arquivo = e.target.files?.[0];
        if (!arquivo) return;
        e.target.value = ""; // permite escolher a mesma foto de novo
        setErro("");


        if (!arquivo.type.startsWith("image/")) return setErro("Escolha uma imagem.");
        if (arquivo.size > 25 * 1024 * 1024) return setErro("A foto passa de 25 MB.");

        setEnviando(true);
        const caminho = `${usuario.id}/avatar`;

        let imagem: Blob;
        try {
            imagem = await reduzirImagem(arquivo);
        } catch {
            setEnviando(false);
            return setErro("Não consegui ler essa foto. Use JPG ou PNG.");
        }

        const { error } = await supabase.storage
      .from("avatares")
      .upload(caminho, imagem, { upsert: true, contentType: "image/jpeg" });
    if (error) {
      setEnviando(false);
      console.error("Erro no upload:", error);
        return setErro(`Não foi possível enviar a foto: ${error.message}`);
    }  

        const { data } = supabase.storage.from("avatares").getPublicUrl(caminho);
    const nova = `${data.publicUrl}?v=${Date.now()}`;
        
        const { error: erroPerfil } = await supabase.auth.updateUser({ data: { avatar_url: nova } });
        setEnviando(false);
        if (erroPerfil) return setErro("Foto enviada, mas não salva no perfil.");

        setUrl(nova);

    }   

    return (
        <div className="avatar-bloco">
            <button type="button"
            className="avatar"
            onClick={() => inputRef.current?.click()}
            title="Trocar foto"
            disabled={enviando}
            >
             {url ? <img src={url} alt="Sua foto"/> : <span>{inicial}</span>}
             <span className="avatar-editar">{enviando ? "..." : "trocar"}</span>   
            </button>
            <input ref={inputRef} type="file" accept="image/*" hidden onChange={aoEscolher} />
            {erro && <p className="erro">{erro}</p>}
        </div>
    );
    
}