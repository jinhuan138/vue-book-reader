# Display page number for current chapter

:::demo
```vue
<template>
  <div style="height: 100vh; position: relative;">
    <vue-reader
      url="/vue-book-reader/files/啼笑因缘.epub"
      :getRendition="getRendition"
    />
    <div :class="$style.page">{{ page }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VueReader from 'vue-book-reader'

const page = ref('')
const getRendition = (rendition) => {
  rendition.addEventListener('relocate', ({ detail }) => {
    const { tocItem } = detail
    page.value = tocItem?.label || ''
  })
}
</script>
<style module>
.page {
  position: absolute;
  width: 100%;
  bottom: 0;
  text-align: center;
  z-index: 1;
  color: #000;
}
</style>
```

:::