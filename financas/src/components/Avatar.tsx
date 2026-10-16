import {useRef, useState, type ChangeEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type Props = {usuario: User};

export default function Avatar({ usuario }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [url, setUrl] = useState<string | null>(usuario.user_metadata?.avatar_url ?? null);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");
    const inicial = (usuario.email ?? "?")[0].toUpperCase();

    async function aoEscolher(e: ChangeEvent<HTMLInputElement>) {
        const arquivo = e.target.files?.[0];
        if (!arquivo) return;
        setErro("");


        if (!arquivo.type.startsWith("image/")) return setErro("Escolher uma imagem.");
        if (arquivo.size > 2 * 1024 * 1024) return setErro("Maximo de 2 MB");

        setEnviando(true);
        const caminho = `${usuario}/avatar`;

        const { error } = await supabase.storage
      .from("avatares")
      .upload(caminho, arquivo, { upsert: true, contentType: arquivo.type });
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