---
outline: [2,3]
---

# 介绍

vue-book-reader 是 [foliate-js](https://github.com/johnfactotum/foliate-js) 的 Vue 封装，用于在浏览器中渲染电子书。

## 安装

::: code-group
```sh [npm]
npm install vue-book-reader --save
```

```sh [pnpm]
pnpm add vue-book-reader --save
```
:::

## 基本用法

在 Vue 组件中引入并使用：

<preview path="../../demos/Demo.vue"></preview>

## 不同构建版本

| **模块格式** | **文件名** |
| --- | --- |
| UMD（浏览器使用） | vue-book-reader.umd.js |
| ES Module（打包工具使用） | vue-book-reader.es.js |

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

<style>
html:focus-within {
  scroll-behavior: smooth;
}
</style>