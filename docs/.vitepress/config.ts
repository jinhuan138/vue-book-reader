import { defineConfig } from 'vitepress'
import {
  containerPreview,
  componentPreview,
} from '@vitepress-demo-preview/plugin';
import { resolve } from 'path'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "vue-book-reader",
  description: "vue-book-reader document",
  base: '/vue-book-reader/',
  cleanUrls: true,
  locales: {
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      description: 'vue-book-reader document',
      themeConfig: {
        nav: [{ text: 'Guide', link: '/en/guide/introduction' }],
        sidebar: [
          { text: 'Guide', items: [{ text: 'Introduction', link: '/en/guide/introduction' }] },
          {
            text: 'Tips',
            items: [
              { text: 'page number', link: '/en/tips/page_number' },
              { text: 'custom css', link: '/en/tips/custom_css' },
              { text: 'smooth scroll', link: '/en/tips/smooth_scroll' },
              { text: 'scrolled', link: '/en/tips/scrolled' },
              { text: 'book information', link: '/en/tips/information' },
              { text: 'import file', link: '/en/tips/import_file' },
              { text: 'current progress', link: '/en/tips/current_progress' },
              { text: 'search', link: '/en/tips/search' },
              { text: 'lightbox', link: '/en/tips/lightbox' },
              { text: 'pdf file', link: '/en/tips/pdf_file' },
              { text: 'highlight', link: '/en/tips/highlight' },
            ],
          },
        ],
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      description: '适用于 Vue 的多格式电子书阅读器组件',
      themeConfig: {
        nav: [{ text: '指南', link: '/zh/guide/introduction' }],
        sidebar: [
          { text: '指南', items: [{ text: '介绍', link: '/zh/guide/introduction' }] },
          {
            text: '使用技巧',
            items: [
              { text: '显示页码', link: '/zh/tips/page_number' },
              { text: '自定义样式', link: '/zh/tips/custom_css' },
              { text: '平滑滚动', link: '/zh/tips/smooth_scroll' },
              { text: '滚动阅读', link: '/zh/tips/scrolled' },
              { text: '获取图书信息', link: '/zh/tips/information' },
              { text: '导入文件', link: '/zh/tips/import_file' },
              { text: '当前阅读进度', link: '/zh/tips/current_progress' },
              { text: '搜索图书内容', link: '/zh/tips/search' },
              { text: '图片预览', link: '/zh/tips/lightbox' },
              { text: '阅读 PDF 文件', link: '/zh/tips/pdf_file' },
              { text: '高亮文本', link: '/zh/tips/highlight' },
            ],
          },
        ],
        outlineTitle: '本页目录',
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdatedText: '最后更新',
        darkModeSwitchLabel: '外观',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        langMenuLabel: '切换语言',
      },
    },
  },
  head: [
    ['script', {}, `(function () {
      var base = '/vue-book-reader/'
      var pathname = window.location.pathname
      if (pathname !== base && pathname !== base.slice(0, -1)) return
      var languages = navigator.languages || [navigator.language || '']
      var prefersChinese = languages.some(function (language) {
        return language.toLowerCase().indexOf('zh') === 0
      })
      window.location.replace(base + (prefersChinese ? 'zh/' : 'en/'))
    })()`],
  ],
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    config: (md) => {
      md.use(containerPreview, { clientOnly: true });
      md.use(componentPreview, { clientOnly: true });
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
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Introduction", link: "guide/introduction" }
        ],
      },
      {
        text: "Tips",
        items: [
          { text: "page number", link: "tips/page_number" },
          { text: "custom css", link: "tips/custom_css" },
          { text: "smooth scroll", link: "tips/smooth_scroll" },
          { text: "scrolled", link: "tips/scrolled" },
          { text: "book information", link: "tips/information" },
          { text: "import file", link: "tips/import_file" },
          { text: "current progress", link: "tips/current_progress" },
          { text: "search", link: "tips/search" },
          { text: "lightbox", link: "tips/lightbox" },
          { text: "pdf file", link: "tips/pdf_file" },
          { text: 'highlight', link: 'tips/highlight' },
        ],
      },
    ]
  },
  vite: {
    publicDir: resolve(__dirname, "../../public"),
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or 'modern'
        },
      },
    },
  }
})