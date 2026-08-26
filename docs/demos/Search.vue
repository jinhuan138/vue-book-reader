<template>
    <div style="height: 100vh; position: relative">
        <vue-reader url="/vue-book-reader/files/啼笑因缘.epub" :getRendition="getRendition" />
        <div class="search">
            <input v-model.trim="searchText" placeholder="search" @keyup.enter="search" />
            <div class="searchResults">
                <div v-if="!searchResults.length">Empty</div>
                <div class="item" v-for="(item, index) in searchResults" :key="index" @click="go(item.cfi)">
                    <span>{{ item.pre }}<mark>{{ item.match }}</mark>{{ item.post }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { VueReader } from 'vue-book-reader'
import { ref } from 'vue'

let rendition
const getRendition = (val) => (rendition = val)
const searchText = ref('只在捻花一笑中')
const searchResults = ref([])
const search = async () => {
    if (!searchText.value) return
    const results = []
    for await (const result of rendition.search({ query: searchText.value })) {
        if (result.progress) console.log('search progress:', result.progress)
        if (!result.subitems) continue
        for (const { cfi, excerpt } of result.subitems) results.push({ cfi, ...excerpt })
    }
    searchResults.value = results
}
const go = (cfi) => {
    rendition.goTo?.(cfi)
}
</script>
<style scoped>
.search {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    z-index: 1;
    width: 28rem;
    padding: 1rem;
    font-size: 1.4rem;
    color: #000;
    background: #fff;
}

.searchResults {
    max-height: 40vh;
    overflow-y: auto;
}

.item {
    max-height: 2.8em;
    overflow: hidden;
    padding-top: 0.4rem;
    cursor: pointer;
    border-bottom: 1px solid #eee;
}

mark {
    color: #e8590c;
    background: none;
}
</style>