# vue-book-reader - an easy way to embed a reader into your webapp

vue-book-reader is a vue wrapper for [foliate-js](https://github.com/johnfactotum/foliate-js) - library for rendering e-books in the browser.
Supports EPUB, MOBI, KF8 (AZW3), FB2, CBZ, PDF (experimental; requires PDF.js), or add support for other formats yourself by implementing the book interface

## Basic usage

```bash
npm install vue-book-reader --save
```

And in your vue-component...
:::demo
```vue
<template>
   <div style='height: 100vh'>
      <vue-reader url='/vue-book-reader/files/啼笑因缘.epub'/>
   </div>
</template>
<script setup>
//just need import { VueReader } from 'vue-book-reader'
import { defineClientComponent } from 'vitepress'
const VueReader = defineClientComponent(() => {
  return import('vue-book-reader')
})
</script>
```

:::

## VueReader Attributes

| **Name** | **Description**                   | **Type**               | **Default** |
| -------- | --------------------------------- | ---------------------- | ----------- |
| url      | book url or File                  | `string`/`File`        | —           |
| location | set / update location of the book | `string`/`number`      | —           |
| title    | the title of the book             | `string`               | —           |
| showToc  | whether to show the toc           | `boolean`              | true        |

## VueReader Slots

| **Name** | **Description**                                                                     |
| -------- | ----------------------------------------------------------------------------------- |
| title    | You have access to title by [slot](https://v3.vuejs.org/guide/component-slots.html) |

## Recipes and tips

## custom css
:::demo
```vue
<template>
   <div style='height: 100vh'>
      <vue-reader url='/vue-book-reader/files/啼笑因缘.epub' :getRendition="getRendition"/>
   </div>
</template>

<script setup>
import { defineClientComponent } from 'vitepress'
const VueReader = defineClientComponent(() => {
  return import('vue-book-reader')
})

const getCSS = (style) => [
  `
    html {
      background: #000;
      color: #fff;
    }`,
]
const getRendition = async (rendition) => {
  const { book, renderer } = rendition
  renderer.setStyles(getCSS())
}
</script>
```

:::

## Display a scrolled epub-view
:::demo
```vue
<template>
   <div style='height: 100vh'>
      <vue-reader url='/vue-book-reader/files/啼笑因缘.mobi' :getRendition="getRendition"/>
   </div>
</template>

<script setup>
import { defineClientComponent } from 'vitepress'
const VueReader = defineClientComponent(() => {
  return import('vue-book-reader')
})

const getRendition =(view)=>{
  //scrolled or paginated
  view?.renderer.setAttribute('flow', 'scrolled')
}
</script>
```
:::

## Smooth Scroll
:::demo
```vue
<template>
   <div style='height: 100vh'>
      <vue-reader url='/vue-book-reader/files/啼笑因缘.mobi' :getRendition="getRendition"/>
   </div>
</template>

<script setup>
import { defineClientComponent } from 'vitepress'
const VueReader = defineClientComponent(() => {
  return import('vue-book-reader')
})
const getRendition = (rendition) => {
  rendition.renderer.setAttribute('animated', '')
}
</script>
```
:::


## Import file
:::demo
```vue
<template>
  <div
    style="height: 100vh; position: relative"
    :style="{ height: url ? '100vh' : '50px' }"
  >
      <vue-reader v-if="url" :url="url" />
      <input class="input" type="file" accept=".epub,.mobi,.azw3,.FB2,.CBZ,.PDF" @change="onchange" />
  </div>
</template>

<script setup>
import { defineClientComponent } from 'vitepress'
const VueReader = defineClientComponent(() => {
  return import('vue-book-reader')
})
import { ref } from 'vue'

const url = ref('')
const onchange = (e) => {
  const file = e.target.files[0]
  url.value = file
}
</script>
```
:::

## Current progress
:::demo
```vue
<template>
  <div style="height: 100vh; position: relative">
     <vue-reader
      url="/vue-book-reader/files/啼笑因缘.azw3"
      :getRendition="getRendition"
      @update:location="locationChange"
    />
    <div class="progress">
      <input
        type="number"
        :value="current"
        :min="0"
        :max="100"
        step="1"
        @change="change"
      />%
      <input
        type="range"
        :value="current"
        :min="0"
        :max="100"
        :step="1"
        @change="change"
      />
    </div>
  </div>
</template>

<script setup>
import { defineClientComponent } from 'vitepress'
const VueReader = defineClientComponent(() => {
  return import('vue-book-reader')
})
import { ref } from 'vue'

let view = null
const current = ref(0)
const change = (e) => {
  const value = e.target.value
  current.value = value
  view.goToFraction(parseFloat(value / 100))
}
const getRendition = (val) => (view = val)

const locationChange = (detail) => {
  const { fraction } = detail
  const percent = Math.floor(fraction * 100)
  current.value = percent
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

```
:::

## Get book information
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
    <p>作者:{{ information.author }}</p>
    <p>出版社:{{ information.publisher }}</p>
    <p>语言:{{ information.language }}</p>
    <p>出版日期:{{ information.published }}</p>
    <p>介绍:{{ information.description }}</p>
  </div>
</template>

<script setup>
import { defineClientComponent } from 'vitepress'
const VueReader = defineClientComponent(() => {
  return import('vue-book-reader')
})
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
```
:::

## Search in the book

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
import { defineClientComponent } from 'vitepress'
const VueReader = defineClientComponent(() => {
  return import('vue-book-reader')
})
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
<style>
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

