<template>
    <div style='height: 100vh'>
        <vue-reader url='/vue-book-reader/files/梵高手稿.epub' :getRendition="getRendition" />
    </div>
    <vue-easy-lightbox :visible="visibleRef" :imgs="imgsRef" :index="indexRef" @hide="visibleRef = false" />
</template>

<script setup>
import { VueReader } from 'vue-book-reader'
import VueEasyLightbox from 'vue-easy-lightbox'
import { ref } from 'vue'

const imgsRef = ref([])
const indexRef = ref(0)
const visibleRef = ref(false)

const getRendition = (rendition) => {
    rendition.renderer.setStyles([
        `img, image {
        cursor: pointer;
      }`
    ])
    rendition.addEventListener('load', () => {
        const docs = rendition.renderer.getContents()
        docs.forEach(({ doc }) => {
            const imgs = [
                ...doc.querySelectorAll('img'),
                ...doc.querySelectorAll('image'),
            ]
            imgsRef.value = imgs.map((img, index) => {
                img.addEventListener('click', () => {
                    visibleRef.value = true
                    indexRef.value = index
                })
                return img.getAttribute('src') || img.getAttribute('xlink:href')
            })
        })
    })
}
</script>