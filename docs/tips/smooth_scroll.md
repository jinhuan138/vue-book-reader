# Smooth scroll
:::demo
```vue
<template>
   <div style='height: 100vh'>
      <vue-reader url='/vue-book-reader/files/啼笑因缘.mobi' :getRendition="getRendition"/>
   </div>
</template>

<script setup>
import { VueReader } from 'vue-book-reader'

const getRendition = (rendition) => {
   rendition.renderer.setAttribute('animated', '')
   //rendition.value.renderer.removeAttribute('animated')
}
</script>
```
:::