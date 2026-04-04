// Medieval bookmark marker — draggable element
// SVG provided by user, used as the interactive text-displacing object

import markerSvgRaw from './marker-asset.svg?raw'

export const MARKER_WIDTH = 75
export const MARKER_HEIGHT = 100

export function createMarkerElement() {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = markerSvgRaw
  const svg = wrapper.querySelector('svg')
  svg.setAttribute('width', String(MARKER_WIDTH))
  svg.setAttribute('height', String(MARKER_HEIGHT))
  svg.removeAttribute('x')
  svg.removeAttribute('y')
  svg.style.display = 'block'
  return svg
}
