// Datas no formato do banco (AAAA-MM-DD) e no fuso local do usuário.

export const hojeISO = () => new Date().toLocaleDateString("sv-SE"); // 2026-10-19
export const mesAtual = () => hojeISO().slice(0, 7); // 2026-10

// 2026-10-19 -> 19/10/2026
export function dataBR(iso: string): string {
  return iso.split("-").reverse().join("/");
}
