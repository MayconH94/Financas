// Registra o service worker e avisa o app quando há uma versão nova publicada.

// nome do arquivo principal que está rodando agora, ex.: /assets/index-AbC123.js
function scriptAtual(): string | null {
  const el = Array.from(document.scripts).find((s) => /\/assets\/index-[^/]+\.js/.test(s.src));
  return el ? new URL(el.src).pathname : null;
}

// busca a página publicada e compara o nome do arquivo principal
async function haVersaoNova(): Promise<boolean> {
  const atual = scriptAtual();
  if (!atual) return false;
  try {
    const resp = await fetch(`/?checar=${Date.now()}`, { cache: "no-store" });
    const html = await resp.text();
    const publicado = html.match(/\/assets\/index-[^"']+\.js/)?.[0];
    return !!publicado && publicado !== atual;
  } catch {
    return false; // sem internet: não avisa
  }
}

export function registrarServiceWorker() {
  if (!import.meta.env.PROD) return;

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }

  let avisou = false;
  async function conferir() {
    if (avisou || !(await haVersaoNova())) return;
    avisou = true;
    window.dispatchEvent(new Event("pwa-atualizacao"));
  }

  window.addEventListener("load", () => setTimeout(conferir, 3000));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void conferir();
  });
  setInterval(conferir, 30 * 60 * 1000);
}
