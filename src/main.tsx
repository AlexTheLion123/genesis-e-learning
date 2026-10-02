import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { App } from './App'
import { DemoProvider } from './store'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/app">
      <DemoProvider>
        <App />
        <Toaster position="bottom-right" richColors />
      </DemoProvider>
    </BrowserRouter>
  </StrictMode>,
)
