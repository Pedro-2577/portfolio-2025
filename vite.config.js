import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    base: process.env.GITHUB_ACTIONS ? '/portfolio-2025/' : '/',
    plugins: [vue()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
});
