import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !chave){
    throw new Error("faltam VITE_SUPABASE e VITE_SUPABSE_ANON_KEY no .env.local");
}

export const supabase = createClient(url, chave);