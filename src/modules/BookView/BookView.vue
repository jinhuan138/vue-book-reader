<template>
  <div class="reader">
    <div class="viewHolder">
      <div ref="viewer" id="viewer" v-show="isLoaded"></div>
      <div v-if="!isLoaded">
        <slot name="loadingView"> </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
//https://github.com/johnfactotum/foliate-js
//https://github.com/johnfactotum/foliate
import '../utils/foliate-js/vendor/pdfjs/pdf.js'
import '../utils/foliate-js/vendor/pdfjs/pdf.worker.js'
import { getView } from '../utils/foliate-js/reader.js'
import {
  clickListener,
  swipListener,
  wheelListener,
  keyListener,
} from '../utils/listener/listener'
import { ref, toRefs, watch, onMounted } from 'vue'

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

const getCSS = ({ spacing, justify, hyphenate }) => `
    @namespace epub "http://www.idpf.org/2007/ops";
    html {
        color-scheme: light dark;
    }
    /* https://github.com/whatwg/html/issues/5426 */
    @media (prefers-color-scheme: dark) {
        a:link {
            color: lightblue;
        }
    }
    p, li, blockquote, dd {
        line-height: ${spacing};
        text-align: ${justify ? 'justify' : 'start'};
        -webkit-hyphens: ${hyphenate ? 'auto' : 'manual'};
        hyphens: ${hyphenate ? 'auto' : 'manual'};
        -webkit-hyphenate-limit-before: 3;
        -webkit-hyphenate-limit-after: 2;
        -webkit-hyphenate-limit-lines: 2;
        hanging-punctuation: allow-end last;
        widows: 2;
    }
    /* prevent the above from overriding the align attribute */
    [align="left"] { text-align: left; }
    [align="right"] { text-align: right; }
    [align="center"] { text-align: center; }
    [align="justify"] { text-align: justify; }

    pre {
        white-space: pre-wrap !important;
    }
    aside[epub|type~="endnote"],
    aside[epub|type~="footnote"],
    aside[epub|type~="note"],
    aside[epub|type~="rearnote"] {
        display: none;
    }
`

const initBook = async () => {
  if (url.value) {
    view && view.close()
    if (typeof url.value === 'string') {
      fetch(url.value)
        .then((res) => res.blob())
        .then(async (blob) => {
          const arr = url.value.split('/')
          view = await getView(
            new File([blob], arr[arr.length - 1]),
            viewer.value,
          )
          initReader()
        })
        .catch((e) => console.error(e))
    } else {
      view = await getView(url.value, viewer.value)
      initReader()
    }
  }
}

const initReader = () => {
  isLoaded.value = true
  const { book } = view
  view.renderer.setStyles?.(
    getCSS({
      spacing: 1.4,
      justify: true,
      hyphenate: true,
    }),
  )
  registerEvents()
  getRendition(view)
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

const onRelocate = ({ detail }) => {
  emit('update:location', detail)
}

const nextPage = () => view?.next()

const prevPage = () => view?.prev()

const setLocation = (href) => view?.goTo(href)

watch(url, () => {
  initBook()
})

onMounted(() => {
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
