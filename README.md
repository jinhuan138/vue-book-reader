# Vue Reader - an easy way to embed a reader into your webapp

## Basic usage

```bash
npm install vue-reader --save
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

