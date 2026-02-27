<template>
    <div style="height: 100vh; position: relative" :style="{ height: url ? '100vh' : '50px' }">
        <vue-reader v-if="url" :url="url" />
        <input class="input" type="file" accept=".epub,.mobi,.azw3,.FB2,.CBZ,.PDF" @change="onchange" />
    </div>
</template>

<script setup>
import { defineClientComponent } from 'vitepress'
const VueReader = defineClientComponent(() => import('vue-book-reader'))
import { ref } from 'vue'

const url = ref('')
const onchange = (e) => {
    const file = e.target.files[0]
    url.value = file
}
</script>