import {
  Landmark, Scale, PiggyBank, ShieldCheck, Percent, Flame, Layers, Building2,
  type LucideIcon,
} from "lucide-react";

export type Dica = {
  id: string;
  titulo: string;
  resumo: string;
  icone: LucideIcon;
  nivel: "Iniciante" | "Intermediário";
  passos: string[];
  link: { rotulo: string; url: string };
};

export const AVISO = "Conteúdo educativo. Não é recomendação de investimento.";

export const DICAS: Dica[] = [
  {
    id: "selic",
    titulo: "O que é Selic?",
    resumo: "A taxa básica de juros do Brasil.",
    icone: Landmark,
    nivel: "Iniciante",
    passos: [
      "A Selic é a taxa básica de juros da economia. A meta é definida pelo Copom, do Banco Central.",
      "Quando a Selic sobe, a renda fixa tende a render mais e o crédito fica mais caro. Quando cai, acontece o contrário.",
      "Ela é referência para o CDI e para o Tesouro Selic.",
      "A meta muda com o tempo: consulte o valor atual no site do Banco Central.",
    ],
    link: { rotulo: "Banco Central", url: "https://www.bcb.gov.br" },
  },
  {
    id: "ipca-poupanca",
    titulo: "Tesouro IPCA+ vs. Poupança",
    resumo: "Qual protege melhor o seu dinheiro.",
    icone: Scale,
    nivel: "Iniciante",
    passos: [
      "A poupança é simples e tem liquidez imediata, mas costuma render menos que boa parte da renda fixa.",
      "O Tesouro IPCA+ paga a inflação (IPCA) mais uma taxa fixa combinada na compra.",
      "Se vender o Tesouro IPCA+ antes do vencimento, o preço pode oscilar e você pode ter perda. Ele combina com objetivos de longo prazo.",
      "A poupança não cobra IR de pessoa física. O Tesouro tem IR regressivo (de 22,5% a 15%, conforme o prazo) e taxa de custódia da B3.",
      "Compare sempre o rendimento líquido, depois de impostos e taxas, e o prazo.",
    ],
    link: { rotulo: "Tesouro Direto", url: "https://www.tesourodireto.com.br" },
  },
  {
    id: "comece-com-50",
    titulo: "Comece a investir com R$ 50",
    resumo: "Primeiros passos, mesmo com pouco.",
    icone: PiggyBank,
    nivel: "Iniciante",
    passos: [
      "Organize o mês primeiro: saiba quanto sobra depois das despesas (o dashboard ajuda nisso).",
      "Monte a reserva de emergência antes de arriscar, em opções com liquidez diária, como Tesouro Selic ou CDBs com liquidez diária.",
      "Aportes pequenos e regulares valem mais que esperar ter muito dinheiro. Defina um valor fixo por mês.",
      "Confira o valor mínimo e as taxas de cada produto antes de investir.",
      "Só depois da reserva pense em renda variável (ações, FIIs), com dinheiro que você não vai precisar no curto prazo.",
    ],
    link: { rotulo: "Portal do Investidor (CVM)", url: "https://www.investidor.gov.br" },
  },
  {
    id: "reserva",
    titulo: "Reserva de emergência",
    resumo: "O primeiro passo antes de investir.",
    icone: ShieldCheck,
    nivel: "Iniciante",
    passos: [
      "É um dinheiro para imprevistos: perda de renda, saúde, conserto urgente.",
      "Uma referência comum é guardar de 3 a 6 meses de despesas essenciais (mais, se a renda é instável).",
      "Aqui a prioridade é segurança e liquidez, não rentabilidade.",
      "Mantenha separada do dinheiro do dia a dia, para não gastar sem perceber.",
    ],
    link: { rotulo: "Cidadania Financeira (BC)", url: "https://www.bcb.gov.br/cidadaniafinanceira" },
  },
  {
    id: "cdi",
    titulo: "O que é CDI?",
    resumo: "A régua da renda fixa.",
    icone: Percent,
    nivel: "Iniciante",
    passos: [
      "O CDI é uma taxa usada entre bancos e acompanha de perto a Selic.",
      "Muitos investimentos de renda fixa prometem rendimento como porcentagem do CDI, por exemplo 100% do CDI.",
      "Compare produtos pela mesma base e olhe também liquidez, prazo e o risco de quem emite.",
      "O FGC cobre depósitos e alguns títulos de bancos até R$ 250 mil por CPF e por instituição (confira as regras vigentes).",
    ],
    link: { rotulo: "Portal do Investidor (CVM)", url: "https://www.investidor.gov.br" },
  },
  {
    id: "inflacao",
    titulo: "Inflação e IPCA",
    resumo: "Por que o dinheiro parado perde valor.",
    icone: Flame,
    nivel: "Iniciante",
    passos: [
      "Inflação é o aumento geral dos preços. O IPCA, medido pelo IBGE, é o índice oficial.",
      "Se o seu dinheiro rende menos que a inflação, ele perde poder de compra mesmo crescendo na conta.",
      "Por isso se compara o rendimento com o IPCA: o ganho acima da inflação é o ganho real.",
    ],
    link: { rotulo: "IBGE", url: "https://www.ibge.gov.br" },
  },
  {
    id: "juros-compostos",
    titulo: "Juros compostos",
    resumo: "Juros sobre juros, e o poder do tempo.",
    icone: Layers,
    nivel: "Iniciante",
    passos: [
      "Nos juros compostos, o rendimento de cada mês passa a render também.",
      "O tempo pesa mais que o valor: começar cedo, mesmo com pouco, faz diferença.",
      "Exemplo ilustrativo (não é promessa): R$ 100 por mês a 1% ao mês dão cerca de R$ 1.268 em 12 meses, contra R$ 1.200 aportados.",
      "Os juros compostos também trabalham contra você em dívidas, como cartão de crédito e cheque especial.",
    ],
    link: { rotulo: "Portal do Investidor (CVM)", url: "https://www.investidor.gov.br" },
  },
  {
    id: "fiis",
    titulo: "O que são FIIs?",
    resumo: "Investir em imóveis pela bolsa.",
    icone: Building2,
    nivel: "Intermediário",
    passos: [
      "Fundos imobiliários permitem investir em imóveis ou títulos imobiliários comprando cotas na bolsa.",
      "Muitos distribuem rendimentos todo mês, mas o valor varia e não é garantido.",
      "O preço da cota oscila na bolsa: é renda variável, com risco.",
      "Olhe o tipo do fundo (tijolo ou papel), a vacância e o histórico, em vez de escolher só pelo maior rendimento.",
    ],
    link: { rotulo: "B3", url: "https://www.b3.com.br" },
  },
];

// "da semana": a cada 7 dias a lista gira e começa por outro tema
const SEMANA_MS = 7 * 24 * 60 * 60 * 1000;
const inicio = Math.floor(Date.now() / SEMANA_MS) % DICAS.length;
export const DICAS_DA_SEMANA = [...DICAS.slice(inicio), ...DICAS.slice(0, inicio)];
