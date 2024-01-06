import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ImportMetaEnvPlugin from "@import-meta-env/unplugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ImportMetaEnvPlugin.vite({
      example: ".env.example",
      // "env": "...",
      // "transformMode": "..."
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Additional Vite configuration...
});