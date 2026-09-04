import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In Docker the API is reachable as "server"; on the host it's localhost.
const proxyTarget = process.env.VITE_PROXY_TARGET || 'http://localhost:5000';

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,       // listen on 0.0.0.0 so the port mapping works
        port: 5173,
        proxy: {
            '/api': {
                target: proxyTarget,
                changeOrigin: true
            }
        },
        watch: {
            usePolling: process.env.CHOKIDAR_USEPOLLING === 'true'
        }
    }
});
