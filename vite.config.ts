import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/pondera/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Pondera - Calculadora de GPA',
        short_name: 'Pondera',
        description: 'Converta suas notas do ensino médio brasileiro para o sistema GPA americano',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
                icons: [
          {
            src: './vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa bibliotecas pesadas em chunks próprios
          'three': ['three'],
          'postprocessing': ['postprocessing'],
          'jspdf': ['jspdf'],
          'jspdf-autotable': ['jspdf-autotable'],
          'recharts': ['recharts'],
          'html2canvas': ['html2canvas'],
          'papaparse': ['papaparse'],
          'animejs': ['animejs'],
          // Separa vendor code (bibliotecas de terceiros) do app code
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'zustand',
            'i18next',
            'react-i18next',
            '@radix-ui/react-icons',
            '@radix-ui/react-label',
            '@radix-ui/react-progress',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-tooltip'
          ]
        }
      }
    }
  }
})
