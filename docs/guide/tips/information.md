# Get book information
:::demo
```vue
<template>
   <vue-reader
      url="/vue-book-reader/files/啼笑因缘.epub"
      :getRendition="getRendition"
      v-show="false"
   />
  <div v-if="information" style="color: #000">
    <img
      :src="information.cover"
      :alt="information.title"
      style="width: 100px"
    />
    <p>标题:{{ information.title }}</p>
    <p>作者:{{ information.author.name }}</p>
    <p>出版社:{{ information.publisher }}</p>
    <p>语言:{{ information.language }}</p>
    <p>出版日期:{{ information.published }}</p>
    <p>介绍:{{ information.description }}</p>
  </div>
</template>

<script setup>
import { defineClientComponent } from 'vitepress'
const VueReader = defineClientComponent(() => import('vue-book-reader'))
import { ref } from 'vue'

const information = ref(null)
const getRendition = (rendition) => {
  rendition.addEventListener('load', () => {
      const { book } = rendition
      information.value =  book.metadata
      book.getCover?.().then((blob) => {
        information.value.cover = URL.createObjectURL(blob)
      })
  })
}
</script>
```
:::