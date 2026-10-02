import { defineConfig } from 'vite'
import type { Connect, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The landing page is the site root (index.html); the app lives under /app.
// Deep links such as /app/learn must load the app, not the landing page.
function appFallback(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, res, next) => {
    const request = req as unknown as { url?: string }
    const [path, query] = (request.url ?? '').split('?')
    if (path === '/app') {
      res.statusCode = 302
      res.setHeader('Location', '/app/' + (query ? `?${query}` : ''))
      res.end()
      return
    }
    if (path.startsWith('/app/') && !path.slice(5).includes('.')) request.url = '/app/index.html' + (query ? `?${query}` : '')
    next()
  }
  return {
    name: 'app-fallback',
    configureServer(server) { server.middlewares.use(rewrite) },
    configurePreviewServer(server) { server.middlewares.use(rewrite) },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), appFallback()],
  build: {
    rollupOptions: {
      input: { main: 'index.html', app: 'app/index.html' },
    },
  },
})
