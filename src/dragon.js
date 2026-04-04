// Stern (Star) — draggable element with rotation physics
// Rotates proportionally to drag movement

import sternSvgRaw from './Stern.svg?raw'

export const STERN_SIZE = 120 // square, displayed size

export function createSternElement() {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = sternSvgRaw
  const svg = wrapper.querySelector('svg')
  svg.setAttribute('width', String(STERN_SIZE))
  svg.setAttribute('height', String(STERN_SIZE))
  svg.removeAttribute('x')
  svg.removeAttribute('y')
  svg.style.display = 'block'
  return svg
}
