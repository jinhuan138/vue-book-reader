/**
 * Listen for key press
 * @param {HTMLElement} el - The element to add event listeners to.
 * @param {function} fn - The listener function.
 */

type Direction = 'next' | 'prev'

export default function keyListener(
  el: HTMLElement,
  fn: (dire: Direction) => void,
) {
  const handler = (e: KeyboardEvent) => {
    // Right or up arrow key indicates next
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      fn('next')
    }
    // left or down arrow key indicates prev
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      fn('prev')
    }
  }
  el.addEventListener('keyup', handler, false)
  return () => el.removeEventListener('keyup', handler, false)
}
