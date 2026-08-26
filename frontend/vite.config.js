import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig(({ command }) => {
  let publicDir = 'public'
  if (command === 'build') {
    const source = resolve('public')
    publicDir = resolve('.generated-public')
    rmSync(publicDir, { recursive: true, force: true })
    mkdirSync(publicDir, { recursive: true })
    cpSync(source, publicDir, { recursive: true })
    const siteUrl = String(process.env.VITE_SITE_URL || process.env.APP_URL || 'https://example.com').replace(/\/$/, '')
    process.env.VITE_SITE_URL = siteUrl
    for (const file of ['robots.txt', 'sitemap.xml']) {
      const target = resolve(publicDir, file)
      writeFileSync(target, readFileSync(target, 'utf8').replaceAll('https://domain-pending.com', siteUrl))
    }
  }
  return {
    envDir: '..',
    plugins: [react()],
    publicDir,
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    server: {
      port: 5180,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true,
        },
      },
    },
  }
})
