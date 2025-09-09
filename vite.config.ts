import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import vue from '@vitejs/plugin-vue'

// https://cn.vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cssInjectedByJsPlugin()],
  build: {
    copyPublicDir: false,
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    outDir: 'lib',
    target: ['edge90', 'chrome90', 'firefox90', 'safari15'],
    lib: {
      entry: 'src/modules/index.ts',
      name: 'vue-book-reader',
      fileName: (format) => `vue-book-reader.${format}.js`
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
