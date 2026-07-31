---
outline: [2,3]
---

# 介绍

`vue-book-reader` 基于 [foliate-js](https://github.com/johnfactotum/foliate-js) 封装，可在 Vue 应用中轻松嵌入电子书阅读器。组件支持 EPUB、MOBI、KF8（AZW3）、FB2、CBZ、TXT 和 PDF（实验性支持，需要 PDF.js）等格式。

## 安装

::: code-group
```sh [npm]
npm install vue-book-reader
```

```sh [pnpm]
pnpm add vue-book-reader
```
:::

## 基本用法

在 Vue 应用中引入并使用组件：

<preview path="../../demos/Demo.vue"></preview>

## 构建产物

| 模块格式 | 文件名 |
| --- | --- |
| UMD（浏览器直接使用） | `vue-book-reader.umd.js` |
| ES Module（打包工具使用） | `vue-book-reader.es.js` |

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

<style>
html:focus-within {
  scroll-behavior: smooth;
}
</style>
