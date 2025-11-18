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
    logo: '/logo.svg',
    nav: [{
      text: "Guide", link: "/guide/introduction"
    }],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jinhuan138/vue-book-reader' }
    ],
    search: {
      provider: 'local',
    },
    sidebar: {
      "/guide/": {
        base: "/guide/",
        items: [
          {
            text: "Guide",
            items: [
              {
                text: "Introduction",
                link: "introduction",
              }
            ],
          },
          {
            text: "Tips",
            items: [
              {
                text: "page number",
                link: "tips/page_number",
              },
              {
                text: "custom css",
                link: "tips/custom_css",
              },
              {
                text: "smooth scroll",
                link: "tips/smooth_scroll",
              }, {
                text: "scrolled",
                link: "tips/scrolled",
              }, {
                text: "information",
                link: "tips/information",
              }, {
                text: "import file",
                link: "tips/import_file",
              },
              {
                text: "current progress",
                link: "tips/current_progress",
              },
              {
                text: "search",
                link: "tips/search",
              },
            ],
          },
        ],
      },
    },
  },
  vite: {
    plugins: [demoblockVitePlugin()],
    publicDir: resolve(__dirname, "../../public"),
    ssr: {
      noExternal: ['vue-book-reader'],
      external: ['canvas']
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or 'modern'
        },
      },
    },
  }
})