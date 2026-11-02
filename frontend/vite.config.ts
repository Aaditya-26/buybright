import { defineConfig, loadEnv, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import http from 'http';

/**
 * Checks if a candidate local port is responding with the BuyBright API
 */
function checkPortResponding(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/health`, { timeout: 500 }, (res) => {
      resolve(Boolean(res.statusCode === 200));
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Automatically & dynamically resolves the active backend URL:
 * 1. Checks explicit VITE_BACKEND_URL or BACKEND_URL (e.g. from .env or live deployment)
 * 2. Checks explicit VITE_BACKEND_PORT or BACKEND_PORT
 * 3. Probes active local candidate ports (8001, 8000, 8080, 8002) to detect where backend is running
 * 4. Falls back gracefully to standard default
 */
async function resolveBackendUrl(configuredUrl?: string, configuredPort?: string | number): Promise<string> {
  if (configuredUrl && configuredUrl.trim()) {
    return configuredUrl.trim();
  }
  if (configuredPort) {
    return `http://127.0.0.1:${configuredPort}`;
  }

  const candidatePorts = [8001, 8000, 8080, 8002];
  for (const port of candidatePorts) {
    if (await checkPortResponding(port)) {
      console.log(`\x1b[36m[vite-proxy] Auto-detected BuyBright backend at: http://127.0.0.1:${port}\x1b[0m`);
      return `http://127.0.0.1:${port}`;
    }
  }

  return 'http://127.0.0.1:8001';
}

// https://vite.dev/config/
export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const env = loadEnv(mode, process.cwd(), '');
  const explicitBackendUrl = env.VITE_BACKEND_URL || env.BACKEND_URL || process.env.VITE_BACKEND_URL || process.env.BACKEND_URL;
  const explicitBackendPort = env.VITE_BACKEND_PORT || env.BACKEND_PORT || process.env.VITE_BACKEND_PORT || process.env.BACKEND_PORT;

  const backendTarget = await resolveBackendUrl(explicitBackendUrl, explicitBackendPort);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: [
            'import',
            'global-builtin',
            'color-functions',
            'if-function',
            'legacy-js-api',
          ],
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
      chunkSizeWarningLimit: 1200,
      cssCodeSplit: true,
      minify: 'esbuild',
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        '/auth': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        '/health': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        '/media': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
