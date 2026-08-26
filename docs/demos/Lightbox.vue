<template>
    <div style='height: 100vh'>
        <vue-reader url='/vue-book-reader/files/玫瑰圣经.epub' :getRendition="getRendition"
            :initOption="{ lastLocation: 'epubcfi(/6/16!/4,/2,/8/4/6/1:4)' }" />
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
        cursor: zoom-in;
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