# Search in the book

:::demo
```vue
<template>
   <div style="height: 100vh; position: relative">
      <vue-reader url="/vue-book-reader/files/啼笑因缘.epub" :getRendition="getRendition" />
   <div class="search">
      <input
         v-model.trim="searchText"
         placeholder="search"
         @keyup.enter="search"
      />
      <div class="searchResults">
         <div v-if="!searchResults.length">Empty</div>
         <div
         class="item"
         v-for="(item, index) in searchResults"
         :key="index"
         @click="go(item.cfi)"
         >
         <span v-html="item.label"> </span>
         </div>
      </div>
   </div>
</div>
</template>

<script setup>
import { VueReader } from 'vue-book-reader'
import { ref } from 'vue'
let rendition
const getRendition = (val) => (rendition = val)
const searchText = ref('只在捻花一笑中')
const searchResults = ref([])
const search = async () => {
  if (!searchText.value) return
  const generator = await rendition.search({
    scope: undefined,
    query: searchText.value,
    index: undefined,
  })
  const results = []
  for await (const result of generator) {
    if (typeof result === 'string') {
      if (result === 'done') {
        console.log('search done')
      }
    } else {
      if (result.progress) {
        console.log('search progress:', result.progress)
      } else {
        results.push(result)
      }
    }
  }
  const tableResults = []
  results.forEach(({ subitems }) => {
    subitems.forEach((item) => {
      const { pre, post } = item.excerpt
      const label = `${pre}<span style='color: orange;'>${searchText.value}</span>${post}`
      tableResults.push({
        label,
        cfi: item.cfi,
      })
    })
  })
  searchResults.value = tableResults
}
const go = (cfi) => {
  rendition.goTo?.(cfi)
}
</script>
<style scoped> 
.search {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  text-align: center;
  z-index: 1;
  color: #000;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search .searchResults {
  width: 200px;
}

.search .searchResults .item {
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-bottom: 1px solid #000;
}

.search .searchResults .item:hover {
  background: rgba(0, 0, 0, 0.05);
}
</style>
```
:::