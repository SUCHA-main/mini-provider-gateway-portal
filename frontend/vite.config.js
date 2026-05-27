import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
    proxy: {
      '/api': 'http://localhost:3100',
      '/v1': 'http://localhost:3100',
      '/proxy': 'http://localhost:3100',
    },
  },
});
