# Read PDF file

:::demo
```vue
<template>
  <div style="height: 100vh;">
    <vue-reader
      url="/vue-book-reader/files/啼笑因缘.pdf"
    />
  </div>
</template>

<script setup>
import { defineClientComponent } from 'vitepress'
const VueReader = defineClientComponent(() => import('vue-book-reader'))
import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs'
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
</script>
```
:::