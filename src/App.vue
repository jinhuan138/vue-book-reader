<template>
  <div style="height: 100vh">
    <VueReader url="/files/啼笑因缘.mobi" @update:location="locationChange" />
    <div class="page">{{ page }}</div>
  </div>
</template>

<script setup>
import VueReader from './modules/VueReader/VueReader.vue'
import { ref } from 'vue'

const page = ref('')
const locationChange = (detail) => {
  const { fraction, location, tocItem, pageItem } = detail
  console.log(fraction)
//   const percent = percentFormat.format(fraction)
  page.value = pageItem ? `Page ${pageItem.label}` : `Loc ${location.current}`
}
</script>
<style>
.page {
  text-align: center;
  z-index: 1;
  color: #000;
}
</style>
