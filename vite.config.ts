import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { name } from './package.json'

// https://cn.vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), libInjectCss()],
  build: {
    copyPublicDir: false,
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
    outDir: 'lib',
    target: ['edge90', 'chrome90', 'firefox90', 'safari15'],
    lib: {
      entry: 'src/modules/index.ts',
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
