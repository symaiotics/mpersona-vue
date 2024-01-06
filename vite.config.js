import { fileURLToPath, URL } from "url";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ImportMetaEnvPlugin from "@import-meta-env/unplugin";


// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },

  // server: {
  //   cors: true,
  //   strictPort: true,
  //   headers: {
  //     'Cross-Origin-Opener-Policy': 'same-origin'
  //   }
  // },

  plugins: [vue(),
  ImportMetaEnvPlugin.vite({ example: ".env.example" }),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: "/src" },
    ],
  },
})

