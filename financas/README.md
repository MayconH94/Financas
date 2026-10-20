# Finflow

Dashboard de finanças pessoais: receitas e despesas, compras parceladas, investimentos com cotações,
conversor de moedas e conteúdo educativo para quem está começando a investir. Funciona como PWA
(instalável no celular).

**Stack:** Vite + React + TypeScript, Supabase (login, banco Postgres e Storage), funções da Vercel em `api/`.

## Rodar localmente

```bash
npm install
npm run dev
```

Crie o arquivo `.env.local` na raiz:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

As funções de `api/` (cotações e moedas) só rodam na Vercel, não no `npm run dev`.
Na Vercel, configure também a variável `BRAPI_TOKEN`.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | confere os tipos e gera a versão de produção |
| `npm run lint` | ESLint |

## Estrutura

```
api/                funções da Vercel (cotacoes.ts, moedas.ts)
public/             manifest.webmanifest, sw.js (PWA) e ícones
src/
  components/       telas e peças de interface (Pagina*, Formulario*, Modal, BarraMobile...)
  hooks/            acesso aos dados (useTransacoes, useParcelamentos, useSessao...)
  utils/            regras e cálculos puros (dinheiro, datas, parcelamentos, categorias...)
  types/            tipos compartilhados
  lib/supabase.ts   cliente do Supabase
```

## Banco de dados (Supabase)

Tabelas `transacoes`, `investimentos` e `parcelamentos`, todas com RLS: cada usuário só acessa as próprias linhas.
Bucket `avatares` no Storage para as fotos de perfil.

Para o "Esqueci minha senha" funcionar, em Authentication → URL Configuration preencha o
**Site URL** e as **Redirect URLs** com o endereço do app (e `http://localhost:5173` para desenvolvimento).
