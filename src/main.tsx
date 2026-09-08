import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

/**
 * In an iOS home-screen app the system sometimes already keeps the web view
 * above the home indicator while `env(safe-area-inset-bottom)` still reports
 * 34px. Adding our own inset on top of that leaves a dead band under the tab
 * bar, so detect the uncovered part of the screen and drop the inset.
 */
function syncBottomInset() {
  const root = document.documentElement
  const portrait = window.innerHeight > window.innerWidth
  const uncovered = (window.screen?.height ?? window.innerHeight) - window.innerHeight

  if (portrait && uncovered > 70) {
    root.style.setProperty('--safe-bottom', '0px')
  } else {
    root.style.removeProperty('--safe-bottom')
  }
}

syncBottomInset()
window.addEventListener('resize', syncBottomInset)
window.addEventListener('orientationchange', syncBottomInset)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
