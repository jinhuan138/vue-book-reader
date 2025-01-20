# vue-book-reader - an easy way to embed a reader into your webapp

vue-book-reader is a vue wrapper for [foliate-js](https://github.com/johnfactotum/foliate-js) - library for rendering e-books in the browser.
Supports EPUB, MOBI, KF8 (AZW3), FB2, CBZ, PDF (experimental; requires PDF.js), or add support for other formats yourself by implementing the book interface

## Document

[document](https://jinhuan138.github.io/vue-book-reader/)

## Basic usage

```bash
npm install vue-book-reader --save
```

And in your vue-component...

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/files/啼笑因缘.epub" />
  </div>
</template>
<script setup>
import { VueReader } from 'vue-book-reader'
</script>
```

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

```vue
<template>
  <vue-reader url="/files/梵高手稿.epub" :getRendition="getRendition">
  </vue-reader>
</template>

<script setup>
import VueReader from 'vue-book-reader'
import { ref } from 'vue'

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

## Display a scrolled epub-view

```vue
<template>
  <div style="height: 100vh">
    <VueReader url="/files/啼笑因缘.mobi" :getRendition="getRendition"/>
  </div>
</template>

<script setup>
import VueReader from 'vue-book-reader'

const getRendition =(view)=>{
  //scrolled or paginated
  view?.renderer.setAttribute('flow', 'scrolled')
}
</script>
```

## Import file

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
import VueReader from 'vue-book-reader'
import { ref } from 'vue'

const url = ref('')
const onchange = (e) => {
  const file = e.target.files[0]
  url.value = file
}
</script>
```

## Current progress

```vue
<template>
  <div style="height: 100vh; position: relative">
    <vue-reader
      url="/files/啼笑因缘.azw3"
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
import VueReader from 'vue-book-reader'
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

## Get book information

```vue
<template>
  <vue-reader
    url="/files/啼笑因缘.azw3"
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
import VueReader from 'vue-book-reader'
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

