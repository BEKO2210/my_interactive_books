// Medieval dragon — Public Domain CC0 SVG from FreeSVG.org
// Single draggable silhouette with animated blinking eyes

import dragonSvgUrl from './dragon-asset.svg?raw'

export const DRAGON_WIDTH = 160
export const DRAGON_HEIGHT = 250

export function createDragonElement() {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = dragonSvgUrl
  const svg = wrapper.querySelector('svg')
  svg.setAttribute('width', String(DRAGON_WIDTH))
  svg.setAttribute('height', String(DRAGON_HEIGHT))
  svg.removeAttribute('x')
  svg.removeAttribute('y')
  svg.removeAttribute('enable-background')
  svg.removeAttribute('xml:space')
  svg.style.display = 'block'

  // Add blinking eyelids over the golden eye areas
  // The SVG has gold (#FCC429) eye accents — we add animated lids
  addBlinkingEyes(svg)

  return svg
}

function addBlinkingEyes(svg) {
  const ns = 'http://www.w3.org/2000/svg'

  // Based on the SVG viewBox coordinates, approximate eye positions
  // The golden #FCC429 paths are small eye accents around (403, 750) area
  // Main eye areas are roughly at these positions in the viewBox
  const eyes = [
    { cx: 313, cy: 963, rx: 14, ry: 14 },   // left eye area
    { cx: 477, cy: 1115, rx: 13, ry: 13 },   // right eye area
  ]

  eyes.forEach((eye, i) => {
    // Eyelid
    const lid = document.createElementNS(ns, 'ellipse')
    lid.setAttribute('cx', eye.cx)
    lid.setAttribute('cy', eye.cy)
    lid.setAttribute('rx', eye.rx + 2)
    lid.setAttribute('ry', '0')
    lid.setAttribute('fill', '#1a1008')
    lid.classList.add('dragon-eyelid')
    lid.dataset.index = i
    svg.appendChild(lid)
  })
}

// --- Blink controller ---
// Randomized blinking at irregular intervals like a real animal

export function startBlinking(dragonEl) {
  const eyelids = dragonEl.querySelectorAll('.dragon-eyelid')
  if (!eyelids.length) return

  function blink() {
    eyelids.forEach(lid => {
      const ry = lid.getAttribute('rx')
      lid.setAttribute('ry', ry)
      setTimeout(() => lid.setAttribute('ry', '0'), 140)
    })

    // Double-blink ~30% of the time
    if (Math.random() < 0.3) {
      setTimeout(() => {
        eyelids.forEach(lid => {
          const ry = lid.getAttribute('rx')
          lid.setAttribute('ry', ry)
          setTimeout(() => lid.setAttribute('ry', '0'), 110)
        })
      }, 280)
    }

    // Next blink: 2–6 seconds
    setTimeout(blink, 2000 + Math.random() * 4000)
  }

  // First blink after 1–3 seconds
  setTimeout(blink, 1000 + Math.random() * 2000)
}
