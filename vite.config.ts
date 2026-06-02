import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  // Charge TOUTES les variables (y compris sans préfixe VITE_)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/rawg': {
          target: 'https://api.rawg.io',
          changeOrigin: true,
          // /rawg/games → /api/games
          rewrite: (p) => p.replace(/^\/rawg/, '/api'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Injecte la clé côté serveur — jamais exposée au navigateur
              const [pathname, search] = proxyReq.path.split('?');
              const params = new URLSearchParams(search ?? '');
              params.set('key', env.RAWG_API_KEY ?? '');
              proxyReq.path = `${pathname}?${params.toString()}`;
            });
          },
        },
      },
    },
  };
});
