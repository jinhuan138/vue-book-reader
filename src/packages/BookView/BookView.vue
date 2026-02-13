<template>
  <div class="reader">
    <div class="viewHolder">
      <div ref="viewer" id="viewer" v-show="isLoaded"></div>
      <div v-if="!isLoaded">
        <slot v-if="isError" name="errorView"> </slot>
        <slot v-else name="loadingView"> </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//https://github.com/johnfactotum/foliate-js
//https://github.com/johnfactotum/foliate
import {
  clickListener,
  swipListener,
  wheelListener,
  keyListener,
} from '../utils/listener/listener'
import { ref, toRefs, watch, onMounted, onUnmounted } from 'vue'
import 'core-js/proposals/array-grouping-v2'
interface FoliateViewElement extends HTMLElement {
  open: (url: string | File) => Promise<void>
  close: () => void
  goTo: (href: string | number) => void
  next: () => void
  prev: () => void
  renderer: any
  book: {
    toc: any[]
  }
}
if (typeof Promise.withResolvers === 'undefined') {
  if (window)
    // @ts-expect-error This does not exist outside of polyfill which this is doing
    window.Promise.withResolvers = function () {
      let resolve, reject
      const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })
      return { promise, resolve, reject }
    }
}
const props = defineProps({
  url: {
    type: [String, File],
    required: true,
  },
  location: {
    type: [String, Number],
  },
  tocChanged: Function,
  getRendition: Function,
})

const { tocChanged, getRendition } = props
const { url, location } = toRefs(props)

const emit = defineEmits(['update:location'])

let view: null | FoliateViewElement = null
const viewer = ref<HTMLElement | null>(null)
const isLoaded = ref<boolean>(false)
const isError = ref<boolean>(false)
const initBook = async () => {
  try {
    if (url?.value) {
      if (view) {
        view.close()
      } else {
        view = document.createElement('foliate-view') as FoliateViewElement
        viewer.value!.append(view)
      }
      await view.open(url.value)
      getRendition && getRendition(view)
      initReader()
    }
  } catch (error) {
    console.error('Error opening book:', error)
    isError.value = true
  }
}

const initReader = () => {
  isLoaded.value = true
  const { book } = view as FoliateViewElement
  registerEvents()
  tocChanged && tocChanged(book.toc)
  if (location && location.value) {
    view?.goTo(location.value)
  } else {
    view!.renderer.next()
  }
}

const flipPage = (direction) => {
  if (direction === 'next') nextPage()
  else if (direction === 'prev') prevPage()
}

const registerEvents = () => {
  view!.addEventListener('load', onLoad)
  view!.addEventListener('relocate', onRelocate)
}

const onLoad = ({ detail: { doc } }) => {
  wheelListener(doc, flipPage)
  swipListener(doc, flipPage)
  keyListener(doc, flipPage)
}
onUnmounted(() => {
  view?.removeEventListener('load', onLoad)
  view?.removeEventListener('relocate', onRelocate)
})

const onRelocate = ({ detail }) => {
  emit('update:location', detail)
}

const nextPage = () => view?.next()

const prevPage = () => view?.prev()

const setLocation = (href: string) => view?.goTo(href)

watch(url, () => {
  initBook()
})

onMounted(async () => {
  if (!customElements.get('foliate-view')) {
    await import('../foliate-js/view.js')
  }
  initBook()
})

defineExpose({
  nextPage,
  prevPage,
  setLocation,
})
</script>

<style scoped>
.reader {
  position: absolute;
  inset: 50px 50px 20px;
}

.viewHolder {
  height: 100%;
  width: 100%;
  position: relative;
}

#viewer {
  height: 100%;
}
</style>
