<template>
    <div style="height: 100vh">
        <vue-reader url="/vue-book-reader/files/啼笑因缘.epub" :getRendition="getRendition" />
    </div>
    <div class="selections">
        <div class="title">Selections</div>
        <div v-for="({ text, cfi }, index) in selections" :key="index" class="item">
            <span :title="text" class="text">{{ text }}</span>
            <button @click="show(cfi)">show</button>
            <button @click="remove(index)">remove</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { VueReader } from 'vue-book-reader'
import { Overlayer } from 'vue-book-reader/dist/overlayer.js'
import { ref } from 'vue'

let rendition: any
const selections = ref<{ cfi: string; text: string }[]>([])

const getRendition = (val) => {
    rendition = val
    rendition.addEventListener('load', ({ detail: { doc, index } }) => {
        doc.addEventListener('pointerup', () => {
            const sel = doc.getSelection()
            const range = sel.rangeCount ? sel.getRangeAt(0) : null
            if (!range || range.collapsed) return
            const cfi = rendition.getCFI(index, range)
            selections.value.push({ cfi, text: sel.toString() })
            rendition.addAnnotation({ value: cfi, type: 'highlight', color: 'red' })
        })
    })
    // highlight/underline/squiggly are all static methods on Overlayer
    rendition.addEventListener('draw-annotation', ({ detail: { draw, annotation } }) =>
        draw(Overlayer[annotation.type], { color: annotation.color }),
    )
}
const show = (cfi: string) => rendition.goTo(cfi)
const remove = (index: number) => {
    rendition.deleteAnnotation({ value: selections.value[index].cfi })
    selections.value.splice(index, 1)
}
</script>

<style scoped>
.selections {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 2;
    width: 24rem;
    padding: 1rem;
    font-size: 1.4rem;
    color: #000;
    background: #fff;
    border: 1px solid #a8a29e;
}

.title {
    font-weight: bold;
}

.item {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.text {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

button {
    padding: 0.2rem 0.6rem;
    cursor: pointer;
    background: #f97316;
    border: none;
}
</style>