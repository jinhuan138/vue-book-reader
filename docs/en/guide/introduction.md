---
outline: [2,3]
---

# Introduction

`vue-book-reader` is a Vue wrapper around [foliate-js](https://github.com/johnfactotum/foliate-js) for rendering e-books in the browser. It supports EPUB, MOBI, KF8 (AZW3), FB2, CBZ, TXT, and PDF (experimental; requires PDF.js).

## Installation

::: code-group
```sh [npm]
npm install vue-book-reader
```

```sh [pnpm]
pnpm add vue-book-reader
```
:::

## Basic usage

Import and use the component in your Vue application:

<preview path="../../demos/Demo.vue"></preview>

## Distribution files

| Module format | File |
| --- | --- |
| UMD (direct browser usage) | `vue-book-reader.umd.js` |
| ES module (bundlers) | `vue-book-reader.es.js` |

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

<style>
html:focus-within {
  scroll-behavior: smooth;
}
</style>
