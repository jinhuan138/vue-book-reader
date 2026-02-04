# Custom css
:::demo
```vue
<template>
   <div style='height: 100vh'>
      <vue-reader url='/vue-book-reader/files/啼笑因缘.epub' :getRendition="getRendition"/>
   </div>
</template>

<script setup>
import { VueReader } from 'vue-book-reader'
const getCSS = (style) => [
  `
    html {
      background: #000;
      color: #fff;
    }`,
]
const getRendition = (rendition) => {
  rendition.addEventListener('load', () => {
    rendition.renderer.setStyles(getCSS())
  })
}
</script>
<style scoped>
:deep(.readerArea) {
  background: #000 !important;
}
:deep(.readerArea .titleArea) {
  color: #ccc !important;
}

:deep(.readerArea .arrow) {
  color: white !important;
}

:deep(.tocArea) {
  color: #ccc !important;
  background: #111 !important;
}

:deep(.tocButtonExpanded) {
  background: #222 !important;
}

:deep(.tocButtonBar) {
  background: #fff !important;
}

:deep(.tocButton) {
  color: white !important;
}
</style>
```
:::