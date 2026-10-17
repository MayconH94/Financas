// Função serverless (Vercel). Mantém o token da brapi no servidor.
// GET /api/cotacoes?bolsa=PETR4,MXRF11&cripto=BTC,ETH
const BRAPI = "https://brapi.dev/api";

type Cotacao = { codigo: string; precoEmCentavos: number };

function lista(valor: string | null): string[] {
  return (valor ?? "")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter((c) => /^[A-Z0-9]{1,12}$/.test(c))
    .slice(0, 30);
}

async function buscar(url: string): Promise<unknown> {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`brapi ${resposta.status}`);
  return resposta.json();
}

export async function GET(request: Request): Promise<Response> {
  const token = process.env.BRAPI_TOKEN;
  if (!token) return Response.json({ erro: "BRAPI_TOKEN não configurado" }, { status: 500 });

  const params = new URL(request.url).searchParams;
  const bolsa = lista(params.get("bolsa"));
  const cripto = lista(params.get("cripto"));

  const tarefas: Promise<Cotacao | null>[] = [
    ...bolsa.map(async (codigo) => {
      const dados = (await buscar(`${BRAPI}/quote/${codigo}?token=${token}`)) as {
        results?: { regularMarketPrice?: number }[];
      };
      const preco = dados.results?.[0]?.regularMarketPrice;
      return typeof preco === "number" ? { codigo, precoEmCentavos: Math.round(preco * 100) } : null;
    }),
    ...cripto.map(async (codigo) => {
      const dados = (await buscar(`${BRAPI}/v2/crypto?coin=${codigo}&currency=BRL&token=${token}`)) as {
        coins?: { regularMarketPrice?: number }[];
      };
      const preco = dados.coins?.[0]?.regularMarketPrice;
      return typeof preco === "number" ? { codigo, precoEmCentavos: Math.round(preco * 100) } : null;
    }),
  ];

  const resultados = await Promise.allSettled(tarefas);
  const cotacoes = resultados
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter((c): c is Cotacao => c !== null);

  return Response.json(cotacoes, { headers: { "Cache-Control": "s-maxage=60" } });
}
