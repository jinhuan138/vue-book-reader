# lightbox

:::demo
```vue
<template>
   <div style='height: 100vh'>
      <vue-reader url='/vue-book-reader/files/梵高手稿.epub' :getRendition="getRendition"/>
   </div>
   <vue-easy-lightbox
      :visible="visibleRef"
      :imgs="imgsRef"
      :index="indexRef"
      @hide="visibleRef = false"
   />
</template>

<script setup>
import { defineClientComponent } from 'vitepress'
const VueReader = defineClientComponent(() => import('vue-book-reader'))
import VueEasyLightbox from 'vue-easy-lightbox'
import { ref } from 'vue'

const imgsRef = ref([])
const indexRef = ref(0)
const visibleRef = ref(false)

const getRendition = (rendition) => {
  rendition.addEventListener('load', () => {
    rendition.renderer.setStyles([
      `img, image {
        cursor: pointer;
      }`
    ])
    const docs = rendition.renderer.getContents()
    docs.forEach(({ doc }) => {
      imgsRef.value = []
      const imgs = [
        ...doc.querySelectorAll('img'),
        ...doc.querySelectorAll('image'),
      ]
      imgs.forEach((img, index) => {
        img.addEventListener('click', () => {
          visibleRef.value = true
          indexRef.value = index
        })
        const src = img.getAttribute('src') || img.getAttribute('xlink:href')
        imgsRef.value.push(src)
      })
    })
  })
}
</script>
```
:::