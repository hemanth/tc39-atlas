import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { typesafeMiddleware } from './src/server/typesafeApi';

function typesafeApiPlugin(): Plugin {
  return {
    name: 'typesafe-api-plugin',
    configureServer(server) {
      server.middlewares.use(typesafeMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(typesafeMiddleware);
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), typesafeApiPlugin()],
  server: {
    port: 5175,
    host: true,
  },
  preview: {
    port: 5175,
    host: true,
  },
});
