<template>
  <div v-for="(item, index) in bookToc" :key="index">
    <button
      :ref="setTocItemRef(item.href)"
      class="tocAreaButton"
      :class="{ active: item.href === current }"
      @click="handleClick(item)"
    >
      {{ isSubmenu ? ' '.repeat(4) + item.label : item.label }}
      <div
        v-if="item.subitems && item.subitems.length > 0"
        class="expansion"
        :class="{ open: item.expansion }"
      ></div>
    </button>
    <div
      v-if="item.subitems && item.subitems.length > 0"
      v-show="item.expansion"
    >
      <!-- 子目录 -->
      <Toc
        :toc="item.subitems"
        :current="current"
        :setLocation="setLocation"
        :isSubmenu="true"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, ref, toRefs, watch } from 'vue'
export interface TocProps {
  toc: Array<any>
  current: string | number | null
  setLocation: (href: string | number, close?: boolean) => void
  isSubmenu?: boolean
}
const bookToc = ref<any[]>([])
const props = withDefaults(defineProps<TocProps>(), {
  isSubmenu: false,
})
const { setLocation } = props
const { toc, current, isSubmenu } = toRefs(props)
const tocItemRefs = new Map<string, HTMLButtonElement>()

const setTocItemRef = (href: string | number) => (element: Element | null) => {
  const key = String(href)
  if (element instanceof HTMLButtonElement) tocItemRefs.set(key, element)
  else tocItemRefs.delete(key)
}

const expandCurrentItemParents = (items: any[], href: string | number | null): boolean =>
  items.some((item) => {
    const isCurrentItem = item.href === href
    const hasCurrentChild = item.subitems?.length
      ? expandCurrentItemParents(item.subitems, href)
      : false

    if (hasCurrentChild) item.expansion = true
    return isCurrentItem || hasCurrentChild
  })

const syncCurrentItem = async (href: string | number | null) => {
  if (href === null) return

  expandCurrentItemParents(bookToc.value, href)
  await nextTick()
  tocItemRefs.get(String(href))?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

const handleClick = (item): void => {
  if (item.subitems && item?.subitems?.length > 0) {
    item.expansion = !item.expansion
    setLocation(item.href, false)
  } else {
    setLocation(item.href)
  }
}
watch(
  toc,
  (newToc) => {
    const expansionMap = new Map(bookToc.value.map((item) => [item.href, item.expansion]))
    bookToc.value = newToc.map((item) => ({
      ...item,
      expansion: expansionMap.get(item.href) ?? false,
    }))
    void syncCurrentItem(current.value)
  },
  { immediate: true },
)

watch(
  current,
  (href) => {
    void syncCurrentItem(href)
  },
  { immediate: true },
)
</script>
<style scoped>
/* ↓ */
.tocAreaButton .expansion::before {
  transform: rotate(-45deg) translateX(2.5px);
}

.tocAreaButton .expansion::after {
  transform: rotate(45deg) translateX(-2.5px);
}

/* ↑ */
.tocAreaButton .open::before {
  transform: rotate(45deg) translateX(2.5px);
}

.tocAreaButton .open::after {
  transform: rotate(-45deg) translateX(-2.5px);
}

.tocAreaButton {
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

.tocAreaButton:hover {
  background: rgba(0, 0, 0, 0.05);
}

.tocAreaButton:active {
  background: rgba(0, 0, 0, 0.1);
}

.active {
  color: #1565c0;
  border-bottom: 2px solid #1565c0;
}

/* 二级目录 */
.tocAreaButton .expansion {
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

.tocAreaButton .expansion::after,
.tocAreaButton .expansion::before {
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
</style>
