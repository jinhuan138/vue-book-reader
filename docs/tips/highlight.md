# Hightlight
:::demo
```vue
<template>
<div style="height: 100vh">
   <vue-reader
      url="/vue-book-reader/files/啼笑因缘.epub"
      :getRendition="getRendition"
   />
  <div class="selections-panel">
    <div class="selections-title">Selections</div>
      <ul class="selections-list">
      <li v-for="({ text, cfi }, index) in selections" :key="index" class="selections-item">
        <span :title="text" class="selections-text">{{text}}</span>
        <button class="selections-btn" @click="show(cfi)">show</button>
        <button class="selections-btn" @click="remove(index)">remove</button>
      </li>
    </ul>
  </div>
</div>
</template>

<script setup lang="ts">
import { VueReader } from 'vue-book-reader'
import { Overlayer } from 'vue-book-reader/dist/overlayer.js'
import { ref } from 'vue'

interface Item {
    cfi: string
    text: string
}

let rendition = null
const selections = ref<Item[]>([])

const getSelectionRange = (sel: Selection) => {
    if (!sel || !sel.rangeCount) return
    const range = sel?.getRangeAt(0)
    if (range.collapsed) return
    return range
}
const getRendition = (val) => {
    rendition = val
    rendition.addEventListener('load', (e) => {
        const { doc, index } = e.detail
        doc.addEventListener('pointerup', () => {
            const sel = doc.getSelection() as Selection
            const range = getSelectionRange(sel)
            if (!range) return
            const cfi = rendition.getCFI(index, range)
            const text = sel.toString()
            const annotation = {
                value: cfi,
                type: 'highlight',
                color: 'red',
                note: text,
            }
            selections.value = [...selections.value, { text, cfi }]
            rendition.addAnnotation(annotation)
        })
    })
    rendition.addEventListener('draw-annotation', (e) => {
        const { draw, annotation } = e.detail
        const { color, type } = annotation
        if (type === 'highlight') draw(Overlayer.highlight, { color })
        else if (type === 'underline') draw(Overlayer.underline, { color })
        else if (type === 'squiggly') draw(Overlayer.squiggly, { color })
    })
}
const show = (cfi: string) => {
    rendition.goTo(cfi)
}
const remove = (index: number) => {
    selections.value = selections.value.filter((i, j) => {
        if (index !== j) {
            return true
        } else {
            const annotation = {
                value: i.cfi,
                note: i.text,
            }
            rendition.addAnnotation(annotation, true)
            return false
        }
    })
}
</script>

<style scoped>
.selections-panel {
  z-index: 1;
  color: #000;
  background-color: #fff;
  border: 1px solid #a8a29e;
}

.selections-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.selections-list {
  border-color: #a8a29e;
}

.selections-item {
  display: flex;
  justify-content: space-between;
}

.selections-text {
  width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.selections-btn {
  color: #737373;
  text-align: center;
  background-color: #f97316;
  cursor: pointer;
  margin-right: 5px;
  border-radius: 10px;
  padding: 5px
}
</style>
```
:::