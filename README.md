<div align="center">
  <img width=250 src="https://raw.githubusercontent.com/jinhuan138/vue--book-reader/master/public/logo.png" />
  <h1>VueBookReader</h1>
</div>

<p>
  <a href="https://www.npmjs.com/package/vue-book-reader" target="_blank">
    <img src="https://img.shields.io/npm/v/vue-book-reader?style=flat-square" />
  </a>
  <a href="https://www.npmjs.com/package/vue-book-reader" target="_blank" >
    <img src="https://img.shields.io/npm/dw/vue-book-reader?style=flat-square" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/npm/l/vue-book-reader?style=flat-square" />
  </a>
</p>

<div align="center">
  <h2><a href="https://jinhuan138.github.io/vue-book-reader/">📖Documentation</a></h2>
</div>


# Introduction

vue-book-reader is a vue wrapper for [foliate-js](https://github.com/johnfactotum/foliate-js) - library for rendering e-books in the browser.
Supports EPUB, MOBI, KF8 (AZW3), FB2, CBZ, PDF (experimental; requires PDF.js), or add support for other formats yourself by implementing the book interface


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
| loadingView | epub view loadingView                                                            |

## EpubView Exposes

| **Name**    | **Description**        | **Type**         |
| ----------- | ---------------------- | ---------------- |
| nextPage    | display  next page     | `function`       |
| prevPage    | display  previous page | `function`       |
| setLocation | Set the page           | `function(href)` |

