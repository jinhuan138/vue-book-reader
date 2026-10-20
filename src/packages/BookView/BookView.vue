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
import { ref, toRefs, watch, onMounted, onUnmounted, nextTick, type PropType } from 'vue'
import 'core-js/proposals/array-grouping-v2'
import 'core-js/proposals/promise-with-resolvers'
interface FoliateViewElement extends HTMLElement {
  open: (url: string | File) => Promise<void>
  close: () => void
  goTo: (href: string | number) => Promise<unknown>
  next: () => Promise<void>
  prev: () => Promise<void>
  init: (options: { lastLocation?: string | number; showTextStart?: boolean }) => Promise<void>
  lastLocation?: { cfi?: string }
  renderer: any
  book: {
    toc: any[]
    destroy?: () => void
  }
}
const props = defineProps({
  url: {
    type: [String, Object] as PropType<string | File>,
    required: true,
  },
  location: {
    type: [String, Number, Object] as PropType<string | number | { cfi: string }>,
  },
  initOption: {
    type: Object,
  },
  tocChanged: Function,
  getRendition: Function,
})

const { url, location } = toRefs(props)

const emit = defineEmits(['update:location'])

let view: null | FoliateViewElement = null
const viewer = ref<HTMLElement | null>(null)
const isLoaded = ref<boolean>(false)
const isError = ref<boolean>(false)
let loadRequest = 0
let mounted = false
let isReady = false
const openingViews = new WeakSet<FoliateViewElement>()

const closeView = (currentView: FoliateViewElement) => {
  try {
    // 尚未生成首页时，底层 renderer.destroy() 可能抛错，仍需释放图书资源。
    try {
      currentView.close()
    } finally {
      currentView.book?.destroy?.()
    }
  } catch (error) {
    console.warn('Error closing book:', error)
  }
}

const cleanupView = () => {
  const previousView = view
  view = null
  isReady = false
  cleanupDocListeners()
  previousView?.removeEventListener('load', onLoad)
  previousView?.removeEventListener('relocate', onRelocate)
  previousView?.remove()
  // 等 open/init 结束后再关闭，避免破坏仍在运行的底层任务。
  if (previousView && !openingViews.has(previousView)) closeView(previousView)
}

const getLocation = () =>
  typeof location.value === 'object' ? location.value?.cfi : location.value

const initBook = async () => {
  if (!mounted) return
  const request = ++loadRequest
  isLoaded.value = false
  isError.value = false
  cleanupView()
  if (!url.value) return

  let currentView: FoliateViewElement | null = null
  try {
    if (!customElements.get('foliate-view')) {
      await import('../foliate-js/view.js')
    }
    if (request !== loadRequest || !mounted) return
    currentView = document.createElement('foliate-view') as FoliateViewElement
    view = currentView
    openingViews.add(currentView)
    viewer.value!.append(currentView)
    await currentView.open(url.value)
    if (request !== loadRequest) return
    props.getRendition?.(currentView)
    if (request !== loadRequest || view !== currentView) return
    await initReader()
    if (request === loadRequest && view === currentView) isReady = true
  } catch (error) {
    if (request !== loadRequest) return
    console.error('Error opening book:', error)
    isLoaded.value = false
    isError.value = true
    cleanupView()
  } finally {
    if (currentView) {
      openingViews.delete(currentView)
      if (currentView !== view) closeView(currentView)
    }
  }
}

const initReader = async () => {
  const currentView = view!
  isLoaded.value = true
  registerEvents()
  props.tocChanged?.(currentView.book.toc ?? [])
  // 保留 v-show，等待容器恢复尺寸后再排版。
  await nextTick()
  if (view !== currentView) return
  const target = getLocation()
  if (target !== undefined && target !== '') {
    await currentView.goTo(target)
  } else {
    await currentView.init(props.initOption ?? {})
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

const docListenerCleanups = new Map<Document, (() => void)[]>()
let cleanupRootKeyListener: (() => void) | undefined

const cleanupDocListeners = (doc?: Document) => {
  const entries = doc
    ? ([[doc, docListenerCleanups.get(doc) ?? []]] as const)
    : Array.from(docListenerCleanups.entries())

  entries.forEach(([listenerDoc, cleanups]) => {
    cleanups.forEach((cleanup) => cleanup())
    docListenerCleanups.delete(listenerDoc)
  })
}

const onLoad = (e: Event) => {
  if (e.currentTarget !== view) return
  const { doc } = (e as CustomEvent).detail

  // Fixed-layout books (including CBZ) can display two iframe documents at
  // once. Keep listeners for every connected page in the current spread.
  docListenerCleanups.forEach((_, listenerDoc) => {
    if (!listenerDoc.defaultView?.frameElement?.isConnected)
      cleanupDocListeners(listenerDoc)
  })
  cleanupDocListeners(doc)
  docListenerCleanups.set(doc, [
    wheelListener(doc, flipPage),
    swipListener(doc, flipPage),
    keyListener(doc, flipPage),
  ])
}
onUnmounted(() => {
  mounted = false
  loadRequest++
  cleanupView()
  cleanupRootKeyListener?.()
})

const onRelocate = (e: Event) => {
  if (e.currentTarget !== view) return
  const { detail } = e as CustomEvent
  emit('update:location', detail)
}

const nextPage = () => isReady ? view?.next() : undefined

const prevPage = () => isReady ? view?.prev() : undefined

const setLocation = (href: string | number) => isReady ? view?.goTo(href) : undefined

watch(url, () => {
  initBook()
})

watch(getLocation, (target) => {
  if (!isReady || target === undefined || target === '') return
  if (target === view?.lastLocation?.cfi) return
  const request = loadRequest
  setLocation(target)?.catch((error) => {
    if (request === loadRequest) console.error('Error navigating book:', error)
  })
})

onMounted(() => {
  mounted = true
  // Fixed-layout pages are replaced while navigating. Listen on the stable
  // outer document as well, so keyboard navigation survives iframe removal.
  cleanupRootKeyListener = keyListener(document, flipPage)
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
