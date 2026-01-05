import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { name } from './package.json'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://cn.vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), libInjectCss()],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
  },
  build: {
    copyPublicDir: false,
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
    outDir: 'lib',
    target: ['edge90', 'chrome90', 'firefox90', 'safari15'],
    lib: {
      entry: 'src/packages/index.ts',
      name,
      fileName: (format) => `${name}.${format}.js`,
      formats: ['es', 'umd', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
