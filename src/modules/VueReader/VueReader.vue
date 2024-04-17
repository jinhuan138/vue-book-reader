<template>
  <div class="container">
    <div class="readerArea" :class="{ containerExpanded: expandedToc }">
      <!--展开目录 -->
      <button
        v-if="showToc"
        class="tocButton"
        :class="{ tocButtonExpanded: expandedToc }"
        type="button"
        @click="toggleToc"
      >
        <span class="tocButtonBar" style="top: 35%"></span>
        <span class="tocButtonBar" style="top: 66%"></span>
      </button>
      <!-- 书名 -->
      <slot name="title">
        <div class="titleArea">{{ title || bookName }}</div>
      </slot>
      <!-- 阅读 -->
      <book-view
        ref="bookRef"
        v-bind="$attrs"
        :tocChanged="onTocChange"
        :getRendition="onGetRendition"
      >
        <template #loadingView>
          <slot name="loadingView">
            <div class="loadingView">Loading…</div>
          </slot>
        </template>
      </book-view>
      <!-- 翻页 -->
      <button class="arrow pre" @click="pre">‹</button>
      <button class="arrow next" @click="next">›</button>
    </div>
    <!-- 目录 -->
    <div v-if="showToc">
      <div class="tocArea">
        <div v-for="(item, index) in toc" :key="index">
          <button
            type="button"
            class="tocAreaButton"
            @click="setLocation(item.href)"
          >
            {{ item.label }}
            <!-- 展开 -->
            <div
              class="expansion"
              v-if="item.subitems && item.subitems.length > 0"
              :style="{
                transform: item.expansion ? 'rotate(180deg)' : 'rotate(0deg)',
              }"
              @click.stop="item.expansion = !item.expansion"
            ></div>
          </button>
          <!-- 二级目录 -->
          <template v-if="item.subitems && item.subitems.length > 0">
            <div v-show="item.expansion">
              <button
                type="button"
                v-for="(subitem, index) in item.subitems"
                :key="index"
                class="tocAreaButton"
                @click="setLocation(subitem['href'])"
              >
                {{ '&nbsp;'.repeat(4) + subitem['label'] }}
              </button>
            </div>
          </template>
        </div>
      </div>
      <!-- 目录遮罩 -->
      <div v-if="expandedToc" class="tocBackground" @click="toggleToc"></div>
    </div>
  </div>
</template>
<script setup>
import BookView from '../BookView/BookView.vue'
import { ref, reactive, toRefs, onUnmounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
  },
  showToc: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
})

const book = reactive({
  toc: [], //目录
  expandedToc: false, //目录展开
})

const { toc, expandedToc } = toRefs(book)

const bookName = ref('')

let rendition = null

const bookRef = ref(null)
const onGetRendition = (val) => {
  const { book } = val
  rendition = val
  const title = book.metadata?.title
  bookName.value = title || ''
}

const onTocChange = (_toc) => {
  toc.value = _toc
}

const toggleToc = () => {
  expandedToc.value = !expandedToc.value
}

const next = () => {
  bookRef.value?.nextPage()
}
const pre = () => {
  bookRef.value?.prevPage()
}

const setLocation = (href) => {
  bookRef.value.setLocation(href)
  expandedToc.value = false
}
</script>
<style scoped>
/* container */
.container {
  overflow: hidden;
  position: relative;
  height: 100%;
}

.containerExpanded {
  transform: translateX(256px);
}

.readerArea {
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
  background-color: #fff;
  transition: all 0.3s ease;
}

.container .titleArea {
  position: absolute;
  top: 20px;
  left: 50px;
  right: 50px;
  text-align: center;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* toc */
.tocBackground {
  position: absolute;
  left: 256px;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
}

.tocArea {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
  width: 256px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: #f2f2f2;
  padding: 10px 0;
}

/* 滚动条 */
.tocArea::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.tocArea::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
}

.tocArea .tocAreaButton {
  user-select: none;
  appearance: none;
  background: none;
  border: none;
  display: block;
  font-family: sans-serif;
  width: 100%;
  font-size: 0.9em;
  text-align: left;
  padding: 0.9em 1em;
  border-bottom: 1px solid #ddd;
  color: #aaa;
  box-sizing: border-box;
  outline: none;
  cursor: pointer;
  position: relative;
}

.tocArea .tocAreaButton:hover {
  background: rgba(0, 0, 0, 0.05);
}

.tocArea .tocAreaButton:active {
  background: rgba(0, 0, 0, 0.1);
}

.tocArea .active {
  color: #1565c0;
  border-bottom: 2px solid #1565c0;
}

/* 二级目录 */
.tocArea .tocAreaButton .expansion {
  cursor: pointer;
  transform: translateY(-50%);
  top: 50%;
  right: 12px;
  position: absolute;
  width: 10px;
  background-color: #a2a5b4;
  transition:
    transform 0.3s ease-in-out,
    top 0.3s ease-in-out;
}

.tocArea .tocAreaButton .expansion::after,
.tocArea .tocAreaButton .expansion::before {
  content: '';
  position: absolute;
  width: 6px;
  height: 2px;
  background-color: currentcolor;
  border-radius: 2px;
  transition:
    transform 0.3s ease-in-out,
    top 0.3s ease-in-out;
}
/* ↓ */
.tocArea .tocAreaButton .expansion::before {
  transform: rotate(-45deg) translateX(2.5px);
}

.tocArea .tocAreaButton .expansion::after {
  transform: rotate(45deg) translateX(-2.5px);
}
/* ↑ */
.tocArea .tocAreaButton .open::before {
  transform: rotate(45deg) translateX(2.5px);
}

.tocArea .tocAreaButton .open::after {
  transform: rotate(-45deg) translateX(-2.5px);
}
/* tocButton */
.tocButton {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.tocButtonBar {
  position: absolute;
  width: 60%;
  background: #ccc;
  height: 2px;
  left: 50%;
  margin: -1px -30%;
  top: 50%;
  transition: all 0.5s ease;
}

.tocButtonExpanded {
  background: #f2f2f2;
}

/* 翻页 */
.arrow {
  outline: none;
  border: none;
  background: none;
  position: absolute;
  top: 50%;
  margin-top: -32px;
  font-size: 64px;
  padding: 0 10px;
  color: #e2e2e2;
  font-family: arial, sans-serif;
  cursor: pointer;
  user-select: none;
  appearance: none;
  font-weight: normal;
}

.arrow:hover {
  color: #777;
}

.arrow:disabled {
  cursor: not-allowed;
  color: #e2e2e2;
}

.prev {
  left: 1px;
}

.next {
  right: 1px;
}

/* loading */
.loadingView {
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  color: #ccc;
  text-align: center;
  margin-top: -0.5em;
}
</style>
