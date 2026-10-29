# Finflow

Dashboard de finanças pessoais para controlar receitas, despesas, compras parceladas e investimentos em um só lugar. Funciona no computador e no celular, e pode ser instalado como app (PWA).

## Funcionalidades

- **Visão geral** com saldo, receitas, despesas e resumo por categoria, filtrado por mês
- **Transações**: cadastro, edição e remoção, com categorias
- **Parcelas**: acompanhe compras parceladas e quanto falta pagar
- **Relatórios**: maiores gastos, consumo dos últimos 6 meses e metas de gasto por categoria
- **Investimentos**: carteira com cotações de ações, FIIs e criptomoedas (via brapi)
- **Conversor de moedas** com taxas atualizadas
- **Aprender**: dicas e conteúdo para quem está começando a investir
- **Tema claro e escuro**, seguindo o sistema ou a sua escolha
- **Login** com e-mail e senha, recuperação de senha e foto de perfil

## Tecnologias

- [Vite](https://vite.dev), [React](https://react.dev) e TypeScript
- [Supabase](https://supabase.com): autenticação, banco Postgres (com RLS) e Storage
- Funções serverless da [Vercel](https://vercel.com) em `api/`
- [brapi](https://brapi.dev) (cotações) e [Frankfurter](https://frankfurter.dev) (câmbio)

## Rodando localmente

Pré-requisito: Node.js 24 ou superior (testado com a 24.19).

```bash
cd financas
npm install
npm run dev
```

Crie o arquivo `financas/.env.local`:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

As funções de `api/` (cotações e moedas) só rodam na Vercel. No `npm run dev` o app funciona, mas sem cotações automáticas.

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | confere os tipos e gera a versão de produção |
| `npm run lint` | ESLint |

## Deploy na Vercel

1. Importe o repositório e defina o **Root Directory** como `financas`.
2. Configure as variáveis de ambiente:

| Variável | Uso |
| --- | --- |
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | chave pública (anon) do Supabase |
| `BRAPI_TOKEN` | token da brapi, usado só no servidor |

A rota `/api/cotacoes` exige o usuário logado: ela confere o token do Supabase antes de consultar a brapi.

## Configuração do Supabase

- Tabelas `transacoes`, `investimentos`, `parcelamentos` e `metas`, todas com **RLS** ativado. As políticas de insert e update usam `WITH CHECK (user_id = auth.uid())`, e cada usuário só acessa as próprias linhas.
- Bucket `avatares` no Storage, onde cada usuário grava apenas na própria pasta.
- Em Authentication → URL Configuration, preencha o **Site URL** e as **Redirect URLs** com o endereço do app (e `http://localhost:5173` para desenvolvimento). Sem isso, o "Esqueci minha senha" não funciona.
- Para produção, configure um SMTP próprio (Resend, Brevo etc.): o envio padrão do Supabase tem limite baixo de e-mails por hora.

## Estrutura

```
financas/
  api/              funções da Vercel (cotacoes.ts, moedas.ts)
  public/           manifest, service worker (PWA), fontes e ícones
  src/
    components/     telas e peças de interface
    hooks/          acesso aos dados (useTransacoes, useTema, useSessao...)
    utils/          regras e cálculos puros (dinheiro, datas, parcelamentos...)
    types/          tipos compartilhados
    lib/supabase.ts cliente do Supabase
```

## Valores em dinheiro

Os valores são guardados em centavos (inteiros) para evitar erros de ponto flutuante. Nos campos, `38,95` e `38.95` valem R$ 38,95; `1.234,56` vale R$ 1.234,56. O valor máximo aceito é R$ 999.999.999,99.
