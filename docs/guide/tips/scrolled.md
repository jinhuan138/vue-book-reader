# Smooth Scroll
:::demo
```vue
<template>
   <div style='height: 100vh'>
      <vue-reader url='/vue-book-reader/files/啼笑因缘.mobi' :getRendition="getRendition"/>
   </div>
</template>

<script setup>
import { defineClientComponent } from 'vitepress'
const VueReader = defineClientComponent(() => import('vue-book-reader'))
const getRendition = (rendition) => {
   rendition.addEventListener('load', () => {
      rendition.renderer.setAttribute('flow', 'scrolled')
      // rendition.renderer.setAttribute('flow', 'paginated')
  })
}
</script>
```
:::