<div align="center">
  <img width=250 src="https://raw.githubusercontent.com/jinhuan138/vue--book-reader/master/public/logo.png" />
  <h1>VueBookReader</h1>
</div>

[English](./README.md)

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
  <h2><a href="https://jinhuan138.github.io/vue-book-reader/zh/">📖中文文档</a></h2>
</div>

# 介绍

vue-book-reader 是 [foliate-js](https://github.com/johnfactotum/foliate-js) 的 Vue 封装，用于在浏览器中渲染电子书。

支持 EPUB、MOBI、KF8（AZW3）、FB2、CBZ 和 PDF（实验性功能，需要 PDF.js）；也可以通过实现图书接口自行扩展其他格式。

## 基本用法

```bash
npm install vue-book-reader --save
```

在 Vue 组件中引入并使用：

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/vue-book-reader/files/啼笑因缘.epub" />
  </div>
</template>
<script setup>
import { VueReader } from 'vue-book-reader'
</script>
```

## VueReader API

### VueReader 属性

| **名称** | **说明** | **类型** | **默认值** |
| --- | --- | --- | --- |
| url | 图书 URL 或 File | `string`/`File` | — |
| location | 设置或更新图书阅读位置 | `string`/`number` | — |
| title | 图书标题 | `string` | — |
| showToc | 是否显示目录 | `boolean` | true |
| [BookView 属性](#bookview-属性) | 可使用全部 BookView 属性。 | - | |

### VueReader 插槽

| **名称** | **说明** |
| --- | --- |
| title | 图书标题 |
| [BookView 插槽](#bookview-插槽) | 可使用全部 BookView 插槽。 |

### VueReader 暴露的方法

| **名称** | **说明** |
| --- | --- |
| [BookView 暴露的方法](#bookview-暴露的方法) | 可使用 BookView 暴露的全部方法。 |

## BookView API

### BookView 属性

| **名称** | **说明** | **类型** | **默认值** |
| --- | --- | --- | --- |
| url | 图书 URL 或 File | `string`/`File` | — |
| tocChanged | 获取表示图书目录的数组 | `function(href)` | — |

### BookView 插槽

| **名称** | **说明** |
| --- | --- |
| loadingView | BookView 加载状态 |
| errorView | BookView 错误状态 |

### BookView 暴露的方法

| **名称** | **说明** | **类型** |
| --- | --- | --- |
| nextPage | 显示下一页 | `function` |
| prevPage | 显示上一页 | `function` |
| setLocation | 跳转到指定位置 | `function(href)` |