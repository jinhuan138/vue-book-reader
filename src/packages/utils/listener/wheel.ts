/**
 * Listen for wheel and convert them to next or prev action based on direction.
 * @param {HTMLElement} el - The element to add event listeners to.
 * @param {function} fn - The listener function.
 */
type epubEvent = WheelEvent & { ignore?: boolean }
type Direction = 'next' | 'prev'

export default function wheelListener(
  el: Document | HTMLElement,
  fn: (dire: Direction) => void,
) {
  // Required min distance traveled to be considered swipe
  const threshold = 750
  // Maximum time allowed to travel that distance
  const allowedTime = 50

  let dist: number = 0
  let isScrolling: ReturnType<typeof setTimeout> | undefined

  const handler = (e: epubEvent) => {
    if (e.ignore) return
    e.ignore = true

    clearTimeout(isScrolling)

    dist += e.deltaY

    isScrolling = setTimeout(() => {
      if (Math.abs(dist) >= threshold) {
        // If wheel scrolled down it indicates left
        let direction: Direction = Math.sign(dist) > 0 ? 'next' : 'prev'
        fn(direction)
      }

      dist = 0
    }, allowedTime)
  }

  el.addEventListener('wheel', handler as EventListener)
  return () => {
    el.removeEventListener('wheel', handler as EventListener)
    clearTimeout(isScrolling)
    dist = 0
  }
}
