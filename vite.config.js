import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { staticSecurity } from './build/security.mjs';
import { custom404Page } from './build/notFound.mjs';

export default defineConfig({
    // CI reads the current Pages base path, including when a custom domain is configured.
    base: process.env.PORTFOLIO_BASE_PATH || '/',
    plugins: [vue(), staticSecurity(), custom404Page()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
});
