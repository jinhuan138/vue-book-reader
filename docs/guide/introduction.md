---
outline: [2,3]
---

# Introduction

a vue wrapper for [foliate-js](https://github.com/johnfactotum/foliate-js) - library for rendering e-books in the browser

## Installation

::: code-group
```sh [npm]
npm install vue-book-reader --save
```

```sh [pnpm]
pnpm add vue-book-reader --save
```
:::

## Basic Usage

And in your vue-component...

:::demo
```vue
<template>
   <div style='height: 100vh'>
      <vue-reader url='/vue-book-reader/files/啼笑因缘.epub'/>
   </div>
</template>
<script setup>
import { VueReader } from 'vue-book-reader'
</script>
```
:::

## Different Builds

|       **Module**        |       **Filename**        |
| ----------------------- | ------------------------- |
|    UMD(for browsers)    | vue-book-reader.umd.js    |
|        CommonJS         | vue--book-reader.cjs.js   |
| ES Module(for bundlers) | vue--book-reader.es.js    |

## VueReader API

### VueReader Attributes

| **Name** | **Description**                   | **Type**                              | **Default** |
| -------- | --------------------------------- | ------------------------------------- | ----------- |
| url      | book url or File                  | `string`/`File`                       | —           |
| location | set / update location of the book | `string`/`number`                     | —           |
| title    | the title of the book             | `string`                              | —           |
| showToc  | whether to show the toc           | `boolean`                             | true        |
| [BookView Attributes](#bookview-attributes)  |  BookView attributes all can be used. | -           |

### VueReader Slots

| **Name**                          | **Description**                   |
| --------------------------------- | --------------------------------- |
| title                             |  book title                       |
| [BookView slots](#bookview-slots) |  BookView slots all can be used.  |

### VueReader Exposes
| **Name**                              | **Description**                     |
| ------------------------------------- | ----------------------------------- | 
| [BookView Exposes](#bookview-exposes) |  BookView exposes all can be used.  |
## BookView API

### BookView Attributes

| **Name**   | **Description**                   | **Type**                | **Default**      |
| ---------- | --------------------------------- | ----------------------- | ---------------- |
| url        | book url or File                                            | `string`/`File`  |
| tocChanged | get an array representing the table of contents of the book | `function(href)` | 

### BookView Slots

| **Name**    | **Description**          |
| ----------- | ------------------------ |
| loadingView | BookView loadingView     |
| errorView   | BookView errorView     |

### BookView Exposes

| **Name**    | **Description**        | **Type**         |
| ----------- | ---------------------- | ---------------- |
| nextPage    | display  next page     | `function`       |
| prevPage    | display  previous page | `function`       |
| setLocation | Set the page           | `function(href)` |

<style>
html:focus-within {
  scroll-behavior: smooth;
}
</style>
