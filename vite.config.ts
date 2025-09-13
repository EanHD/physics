import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
      manifest: {
        name: 'Quantum Mechanics Study App',
        short_name: 'QM Study',
        description: 'A progressive web app for learning quantum mechanics from beginner to advanced',
        theme_color: '#1f2937',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/physics/',
        start_url: '/physics/',
        icons: [
          {
            src: '/physics/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/physics/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/physics/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,md}'],
        navigateFallback: '/physics/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
  base: '/physics/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})