import { StrictMode } from 'react'
import { ViteReactSSG } from 'vite-react-ssg/single-page'
import './index.css'
import App from './App.tsx'

// Single-page static prerender: vite-react-ssg renders <App /> to static HTML at
// build time (so crawlers/social scrapers get real content) and hydrates on the client.
export const createRoot = ViteReactSSG(
  <StrictMode>
    <App />
  </StrictMode>,
)
