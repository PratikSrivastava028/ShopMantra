import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api/auth': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: false,
      },
      '/api/products': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
      },
      '/api/cart': {
        target: 'http://127.0.0.1:3002',
        changeOrigin: true,
        secure: false,
      },
      '/api/orders': {
        target: 'http://127.0.0.1:3003',
        changeOrigin: true,
        secure: false,
      },
      '/api/payments': {
        target: 'http://127.0.0.1:3004',
        changeOrigin: true,
        secure: false,
      },
      '/api/ai-buddy': {
        target: 'http://127.0.0.1:3005',
        changeOrigin: true,
        secure: false,
      },
      '/api/socket': {
        target: 'http://127.0.0.1:3005',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
      '/api/notifications': {
        target: 'http://127.0.0.1:3006',
        changeOrigin: true,
        secure: false,
      },
      '/api/seller': {
        target: 'http://127.0.0.1:3007',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
