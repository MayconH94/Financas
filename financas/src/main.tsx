import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AvisoAtualizacao from './components/AvisoAtualizacao.tsx'
import InstalarApp from './components/InstalarApp.tsx'
import { registrarServiceWorker } from './utils/pwa.ts'

// PWA: registra o service worker só no site publicado (não no npm run dev)
registrarServiceWorker()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <AvisoAtualizacao />
    <InstalarApp />
  </StrictMode>,
)
