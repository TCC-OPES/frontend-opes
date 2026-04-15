  import { fileURLToPath, URL } from 'node:url';

  import { defineConfig } from 'vite';
  import vue from '@vitejs/plugin-vue';
  import vueDevTools from 'vite-plugin-vue-devtools';
  import { VitePWA } from 'vite-plugin-pwa';

  export default defineConfig({
    plugins: [
      vue(),
      VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      id: '/?source=pwa',
      name: 'Gerenciador de Tarefas',
      short_name: 'Tarefas',
      description: 'Aplicativo PWA para gerenciar tarefas diárias',
      theme_color: '#4a90d9',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      orientation: 'portrait',
      lang: 'pt-BR',
      categories: ['productivity'],
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /\/api\//,  
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 86400,
            },
          },
        },
      ],
    },
    devOptions: {
      enabled: true,
    },
  }),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  });
