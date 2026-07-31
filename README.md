<div align="center">
  <img width="250" src="https://raw.githubusercontent.com/jinhuan138/vue-book-reader/master/public/logo.png" alt="VueBookReader logo" />
  <h1>VueBookReader</h1>
</div>

[简体中文](./README.zh-CN.md)

<p>
  <a href="https://www.npmjs.com/package/vue-book-reader" target="_blank">
    <img src="https://img.shields.io/npm/v/vue-book-reader?style=flat-square" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/vue-book-reader" target="_blank" >
    <img src="https://img.shields.io/npm/dw/vue-book-reader?style=flat-square" alt="weekly npm downloads" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/npm/l/vue-book-reader?style=flat-square" alt="license" />
  </a>
</p>

<div align="center">
  <h2><a href="https://jinhuan138.github.io/vue-book-reader/en/">📖 Documentation</a></h2>
</div>

# Vue Book Reader

`vue-book-reader` is a Vue wrapper around [foliate-js](https://github.com/johnfactotum/foliate-js) for rendering e-books in the browser.

It supports EPUB, MOBI, KF8 (AZW3), FB2, CBZ, TXT, and PDF (experimental; requires PDF.js). You can also add other formats by implementing the book interface.

## Installation

```bash
npm install vue-book-reader
```

## Basic usage

```vue
<template>
  <div style="height: 100vh">
    <VueReader url="/books/example.epub" />
  </div>
</template>

<script setup>
import { VueReader } from 'vue-book-reader'
</script>
```

## VueReader API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `url` | URL or local file for the book. | `string \| File` | Required |
| `title` | Title displayed above the reader. If omitted, the book metadata title is used. | `string` | `''` |
| `showToc` | Whether to show the table-of-contents control. | `boolean` | `true` |
| `getRendition` | Called when the underlying foliate view is ready. | `(view) => void` | — |
| [BookView props](#props-1) | All BookView props can also be passed to VueReader. | — | — |

### Slots

| Name | Description |
| --- | --- |
| `title` | Custom content for the title area. |
| [BookView slots](#slots-1) | All BookView slots are also available. |

### Exposed methods

| Name | Description | Type |
| --- | --- | --- |
| `nextPage` | Go to the next page. | `() => void` |
| `prevPage` | Go to the previous page. | `() => void` |
| `setLocation` | Go to a specific location. | `(href: string) => void` |

## BookView API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `url` | URL or local file for the book. | `string \| File` | Required |
| `location` | Initial or updated reading location. | `string \| number` | — |
| `initOption` | Options passed to the foliate view during initialization. | `object` | — |
| `tocChanged` | Called with the book's table of contents after loading. | `(toc: object[]) => void` | — |
| `getRendition` | Called when the underlying foliate view is ready. | `(view) => void` | — |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `update:location` | Emitted whenever the reading location changes. | Relocation details from foliate-js |

### Slots

| Name | Description |
| --- | --- |
| `loadingView` | Content displayed while the book is loading. |
| `errorView` | Content displayed if the book fails to load. |

### Exposed methods

| Name | Description | Type |
| --- | --- | --- |
| `nextPage` | Go to the next page. | `() => void` |
| `prevPage` | Go to the previous page. | `() => void` |
| `setLocation` | Go to a specific location. | `(href: string) => void` |
