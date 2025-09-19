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
  rendition.renderer.setAttribute('animated', '')
}
</script>
```
:::