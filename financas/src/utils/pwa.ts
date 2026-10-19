// Registra o service worker e avisa o app quando há uma versão nova esperando.
let aplicando = false;

export function registrarServiceWorker() {
  if (!("serviceWorker" in navigator) || !import.meta.env.PROD) return;

  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");

      const avisar = (sw: ServiceWorker) =>
        window.dispatchEvent(new CustomEvent("pwa-atualizacao", { detail: sw }));

      // já tinha uma versão nova esperando
      if (reg.waiting && navigator.serviceWorker.controller) avisar(reg.waiting);

      // uma versão nova acabou de ser baixada
      reg.addEventListener("updatefound", () => {
        const novo = reg.installing;
        novo?.addEventListener("statechange", () => {
          if (novo.state === "installed" && navigator.serviceWorker.controller) avisar(novo);
        });
      });

      // procura versão nova a cada hora (app aberto por muito tempo)
      setInterval(() => void reg.update().catch(() => {}), 60 * 60 * 1000);

      // depois que o usuário toca em "Atualizar", recarrega com a versão nova
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (aplicando) window.location.reload();
      });
    } catch {
      // sem service worker o app funciona normalmente
    }
  });
}

export function aplicarAtualizacao(sw: ServiceWorker) {
  aplicando = true;
  sw.postMessage({ tipo: "PULAR_ESPERA" });
}
