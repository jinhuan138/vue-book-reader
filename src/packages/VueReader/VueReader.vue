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
        <div class="titleArea" :title="title || bookName">
          {{ title || bookName }}
        </div>
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
        <template #errorView>
          <slot name="errorView">
            <div class="errorView">Error loading book</div>
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
        <Toc :toc="toc" :current="currentHref" :setLocation="setLocation" />
      </div>
      <!-- 目录遮罩 -->
      <div v-if="expandedToc" class="tocBackground" @click="toggleToc"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import BookView from '../BookView/BookView.vue'
import Toc from './Toc.vue'
import { ref, reactive, toRefs, useTemplateRef } from 'vue'
type BookViewType = InstanceType<typeof BookView>
const props = defineProps({
  showToc: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
  getRendition: {
    type: Function,
  },
})

const book = reactive({
  toc: [], //目录
  expandedToc: false, //目录展开
})

const { getRendition } = props

const { toc, expandedToc } = toRefs(book)

const bookRef = useTemplateRef<BookViewType>('bookRef')
const currentHref = ref(null)

const bookName = ref('')

let rendition: any = null
const onRelocate = ({ detail }) => {
  currentHref.value = detail.tocItem?.href || null
}
const onGetRendition = (val) => {
  rendition = val
  getRendition && getRendition(rendition)
  rendition.addEventListener('load', () => {
    const { book } = rendition
    const title = book.metadata?.title
    bookName.value = title || ''
  })
  rendition.addEventListener('relocate', onRelocate)
}

const onTocChange = (_toc) => {
  toc.value = _toc
}

const toggleToc = () => {
  expandedToc.value = !expandedToc.value
}

const next = () => {
  bookRef.value!.nextPage()
}
const pre = () => {
  bookRef.value!.prevPage()
}

const setLocation = (href, close = true) => {
  bookRef.value!.setLocation(href)
  expandedToc.value = !close
}

defineExpose({
  nextPage: next,
  prevPage: pre,
  setLocation,
})
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

/* errorView */
.errorView {
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  color: #c00;
  text-align: center;
  margin-top: -0.5em;
}
</style>
