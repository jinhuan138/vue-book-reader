import { defineConfig } from 'vitepress'
import { demoBlockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'
import { resolve } from 'path'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "vue-book-reader",
  description: "vue-book-reader document",
  base: '/vue-book-reader/',
  cleanUrls: true,
  markdown: {
      theme: { light: 'github-light', dark: 'github-dark' },
      config: (md) => {
          md.use(demoBlockPlugin)
      }
  },
  themeConfig: {
    socialLinks: [
        { icon: 'github', link: 'https://github.com/jinhuan138/vue-book-reader' }
    ],
  },
  vite: {
    plugins: [demoblockVitePlugin()],
    publicDir: resolve(__dirname, "../../public"),
    server: {
        port: 3030,
    },
    preview: {
        port: 3333,
    },
    ssr: {
      noExternal: ['vue-book-reader'],
      external:['canvas']
    },
  }
})