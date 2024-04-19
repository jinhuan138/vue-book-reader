<template>
  <vue-reader
    url="/files/啼笑因缘.azw3"
    :getRendition="getRendition"
    v-show="false"
  >
  </vue-reader>
  <div v-if="information" style="color: #000">
    <img
      :src="information.cover"
      :alt="information.title"
      style="width: 100px"
    />
    <p>标题:{{ information.title }}</p>
    <p>作者:{{ information.author }}</p>
    <p>出版社:{{ information.publisher }}</p>
    <p>语言:{{ information.language }}</p>
    <p>出版日期:{{ information.published }}</p>
    <p>介绍:{{ information.description }}</p>
  </div>
</template>

<script setup>
import VueReader from './modules/VueReader/VueReader.vue'
import { ref } from 'vue'

const information = ref(null)
const getRendition = (rendition) => {
  const { book } = rendition
  const { author } = book.metadata
  const bookAuthor =
    typeof author === 'string'
      ? author
      : author
          ?.map((author) => (typeof author === 'string' ? author : author.name))
          ?.join(', ') ?? ''
  information.value = { ...book.metadata, author: bookAuthor }
  book.getCover?.().then((blob) => {
    information.value.cover = URL.createObjectURL(blob)
  })
}
</script>
<style>
.progress {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  z-index: 1;
  color: #000;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.progress > input[type='number'] {
  text-align: center;
}

.progress > input[type='range'] {
  width: 100%;
}
</style>
