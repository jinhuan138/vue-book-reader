<template>
  <div class="reader">
    <div class="viewHolder">
      <div ref="viewer" id="viewer" v-show="isLoaded"></div>
      <div v-if="!isLoaded">
        <slot name="loadingView" v-if="!isError"> </slot>
        <slot name="errorView" v-else> </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
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

let view = null
const viewer = ref(null)
const isLoaded = ref(false)
const isError = ref(false)

const initBook = async () => {
  try {
    if (url.value) {
      if (view) {
        view.close()
      } else {
        view = document.createElement('foliate-view')
        viewer.value.append(view)
      }
      await view.open(url.value)
      getRendition(view)
      initReader()
    }
  } catch (error) {
    console.error('Error opening book:', error)
    isError.value = true
  }
}

const initReader = () => {
  isLoaded.value = true
  const { book } = view
  registerEvents()
  tocChanged && tocChanged(book.toc)
  if (location.value) {
    view?.goTo(location.value)
  } else {
    view.renderer.next()
  }
}

const flipPage = (direction) => {
  if (direction === 'next') nextPage()
  else if (direction === 'prev') prevPage()
}

const registerEvents = () => {
  view.addEventListener('load', onLoad)
  view.addEventListener('relocate', onRelocate)
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

const setLocation = (href) => view?.goTo(href)

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
