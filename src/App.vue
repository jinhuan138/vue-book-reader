<template>
  <vue-reader url="/files/啼笑因缘.epub" :getRendition="getRendition">
  </vue-reader>
</template>

<script setup>
import VueReader from './packages/index'
import { ref } from 'vue'

const information = ref(null)
const getCSS = (style) => [
  `
    html {
      background: #000;
      color: #fff;
    }`,
]
const getRendition = async (rendition) => {
  console.log(
    rendition.search({
      query: '1',index:null
    }),
  )
  // rendition
  //   .getGenerator({
  //     query: '1',
  //   })
  //   .catch((res) => {
  //     console.log(res)
  //   })
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
