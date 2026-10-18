// Função serverless (Vercel): taxas de câmbio da Frankfurter (grátis, sem chave).
// GET /api/moedas  ->  { data: "2026-10-16", taxas: { BRL: 1, USD: 0.18, ... } }
// As taxas são "unidades da moeda para 1 BRL".
const MOEDAS = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF"];

const FONTES = [
  `https://api.frankfurter.dev/v2/rates?base=BRL&quotes=${MOEDAS.join(",")}`,
  `https://api.frankfurter.dev/v1/latest?base=BRL&symbols=${MOEDAS.join(",")}`,
];

type Resultado = { data: string; taxas: Record<string, number> };

// Aceita os dois formatos: { date, rates: { USD: 0.18 } } ou [{ date, quote, rate }]
function interpretar(dados: unknown): Resultado | null {
  const taxas: Record<string, number> = { BRL: 1 };
  let data = "";

  if (Array.isArray(dados)) {
    for (const item of dados as { date?: string; quote?: string; rate?: number }[]) {
      if (item.quote && typeof item.rate === "number") taxas[item.quote] = item.rate;
      if (item.date) data = item.date;
    }
  } else if (dados && typeof dados === "object") {
    const d = dados as { date?: string; rates?: Record<string, number> };
    for (const [moeda, valor] of Object.entries(d.rates ?? {})) {
      if (typeof valor === "number") taxas[moeda] = valor;
    }
    data = d.date ?? "";
  }

  return Object.keys(taxas).length > 1 ? { data, taxas } : null;
}

export async function GET(): Promise<Response> {
  for (const url of FONTES) {
    try {
      const resposta = await fetch(url);
      if (!resposta.ok) continue;
      const resultado = interpretar(await resposta.json());
      if (resultado) {
        return Response.json(resultado, {
          headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
        });
      }
    } catch {
      // tenta a próxima fonte
    }
  }
  return Response.json({ erro: "Câmbio indisponível" }, { status: 502 });
}
