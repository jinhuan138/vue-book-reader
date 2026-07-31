<div align="center">
  <img width="250" src="https://raw.githubusercontent.com/jinhuan138/vue-book-reader/master/public/logo.png" alt="VueBookReader 标志" />
  <h1>VueBookReader</h1>
</div>

[English](./README.md)

<p>
  <a href="https://www.npmjs.com/package/vue-book-reader" target="_blank">
    <img src="https://img.shields.io/npm/v/vue-book-reader?style=flat-square" alt="npm 版本" />
  </a>
  <a href="https://www.npmjs.com/package/vue-book-reader" target="_blank" >
    <img src="https://img.shields.io/npm/dw/vue-book-reader?style=flat-square" alt="npm 每周下载量" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/npm/l/vue-book-reader?style=flat-square" alt="许可证" />
  </a>
</p>

<div align="center">
  <h2><a href="https://jinhuan138.github.io/vue-book-reader/zh/">📖 中文文档</a></h2>
</div>

# Vue 电子书阅读器

`vue-book-reader` 基于 [foliate-js](https://github.com/johnfactotum/foliate-js) 封装，可在 Vue 应用中轻松嵌入电子书阅读器。

组件支持 EPUB、MOBI、KF8（AZW3）、FB2、CBZ、TXT 和 PDF（实验性支持，需要 PDF.js）等格式。你也可以通过实现图书接口扩展其他格式。

## 安装

```bash
npm install vue-book-reader
```

## 基本用法

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

### 属性

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `url` | 图书的 URL 或本地文件。 | `string \| File` | 必填 |
| `title` | 阅读器顶部显示的标题；未传入时使用图书元数据中的标题。 | `string` | `''` |
| `showToc` | 是否显示目录按钮。 | `boolean` | `true` |
| `getRendition` | 底层 foliate 视图准备就绪时调用。 | `(view) => void` | — |
| [BookView 属性](#属性-1) | VueReader 同样支持 BookView 的全部属性。 | — | — |

### 插槽

| 名称 | 说明 |
| --- | --- |
| `title` | 自定义标题区域的内容。 |
| [BookView 插槽](#插槽-1) | 同样支持 BookView 的全部插槽。 |

### 暴露的方法

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| `nextPage` | 翻到下一页。 | `() => void` |
| `prevPage` | 翻到上一页。 | `() => void` |
| `setLocation` | 跳转到指定位置。 | `(href: string) => void` |

## BookView API

### 属性

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `url` | 图书的 URL 或本地文件。 | `string \| File` | 必填 |
| `location` | 初始阅读位置，或要更新到的阅读位置。 | `string \| number` | — |
| `initOption` | 初始化 foliate 视图时传入的选项。 | `object` | — |
| `tocChanged` | 图书加载完成后调用，参数为目录数组。 | `(toc: object[]) => void` | — |
| `getRendition` | 底层 foliate 视图准备就绪时调用。 | `(view) => void` | — |

### 事件

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| `update:location` | 阅读位置发生变化时触发。 | foliate-js 提供的位置变更详情 |

### 插槽

| 名称 | 说明 |
| --- | --- |
| `loadingView` | 图书加载期间显示的内容。 |
| `errorView` | 图书加载失败时显示的内容。 |

### 暴露的方法

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| `nextPage` | 翻到下一页。 | `() => void` |
| `prevPage` | 翻到上一页。 | `() => void` |
| `setLocation` | 跳转到指定位置。 | `(href: string) => void` |
