
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { ElementPlusContainer } from '@vitepress-demo-preview/component';
import '@vitepress-demo-preview/component/dist/style.css';
import { inBrowser,EnhanceAppContext } from 'vitepress'
import useVisitData from '../hooks/useVisitData'
import AccessNumber from '../components/AccessNumber.vue'
import '../styles/index.css'
import pkg from '../../../package.json'
console.log(
  `%c ${pkg.name} %c v`.concat(pkg.version, ' '),
  'background: #f44336; padding: 1px; border-radius: 3px 0 0 3px; color: #fff',
  'background: skyblue; padding: 1px; border-radius: 0 3px 3px 0; color: #fff',
)

export default {
  ...DefaultTheme,
  enhanceApp({ app, router }:EnhanceAppContext) {
    app.component('demo-preview', ElementPlusContainer);
    if (inBrowser) {
      router.onAfterPageLoad = (to: string) => {
        useVisitData()
      }
    }
  },
   Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(AccessNumber)
    })
  }
}