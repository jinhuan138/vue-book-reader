# Current progress
:::demo
```vue
<template>
  <div style="height: 100vh; position: relative">
     <vue-reader
      url="/vue-book-reader/files/啼笑因缘.azw3"
      :getRendition="getRendition"
      @update:location="locationChange"
    />
    <div class="progress">
      <input
        type="number"
        :value="current"
        :min="0"
        :max="100"
        step="1"
        @change="change"
      />%
      <input
        type="range"
        :value="current"
        :min="0"
        :max="100"
        :step="1"
        @change="change"
      />
    </div>
  </div>
</template>

<script setup>
import { VueReader } from 'vue-book-reader'
import { ref } from 'vue'

let view = null
const current = ref(0)
const change = (e) => {
  const value = e.target.value
  current.value = value
  view.goToFraction(parseFloat(value / 100))
}
const getRendition = (val) => (view = val)

const locationChange = (detail) => {
  const { fraction } = detail
  const percent = Math.floor(fraction * 100)
  current.value = percent
}
</script>
<style scoped>
.progress {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  z-index: 1;
  color: #000;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.progress > input[type='number'] {
  text-align: center;
}

.progress > input[type='range'] {
  width: 100%;
}
</style>
```
:::