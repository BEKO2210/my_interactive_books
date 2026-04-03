import {
  prepareWithSegments,
  layoutWithLines,
  layoutNextLine,
} from '@chenglou/pretext'
import { storyBlocks } from './story.js'
import { createDragonSVG, DRAGON_WIDTH, DRAGON_HEIGHT } from './dragon.js'

// --- Font definitions ---
const BODY_FONT = '18px "IM Fell English", "Palatino Linotype", "Book Antiqua", Palatino, serif'
const BODY_ITALIC_FONT = 'italic 18px "IM Fell DW Pica", "Palatino Linotype", serif'
const TITLE_FONT = '32px "Uncial Antiqua", serif'
const SUBTITLE_FONT = 'italic 15px "IM Fell DW Pica", serif'
const HIGHLIGHT_FONT = '19px "IM Fell Great Primer", "Palatino Linotype", serif'
const NOTE_FONT = 'italic 15px "IM Fell DW Pica", serif'
const LIST_FONT = '16px "IM Fell English", "Palatino Linotype", serif'
const WARNING_FONT = '17px "IM Fell Great Primer", "Palatino Linotype", serif'
const COLOPHON_FONT = 'italic 15px "IM Fell DW Pica", serif'

const BODY_LINE_HEIGHT = 31
const TITLE_LINE_HEIGHT = 42
const SUBTITLE_LINE_HEIGHT = 24
const HIGHLIGHT_LINE_HEIGHT = 32
const NOTE_LINE_HEIGHT = 26
const LIST_LINE_HEIGHT = 28
const WARNING_LINE_HEIGHT = 30
const COLOPHON_LINE_HEIGHT = 26

// --- Dragon state ---
const dragon = {
  x: 0,
  y: 0,
  dragging: false,
  offsetX: 0,
  offsetY: 0,
  el: null,
  padding: 16, // space around dragon where text avoids
}

// --- Parchment texture ---
function generateParchmentTexture(canvas) {
  const rect = canvas.parentElement.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = canvas.width = rect.width * dpr
  const h = canvas.height = rect.height * dpr
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, w, h)

  const imageData = ctx.createImageData(w, h)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 55
    data[i] = noise
    data[i + 1] = noise * 0.8
    data[i + 2] = noise * 0.5
    data[i + 3] = Math.random() * 25
  }
  ctx.putImageData(imageData, 0, 0)

  for (let i = 0; i < 20; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const r = Math.random() * 40 + 5
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
    gradient.addColorStop(0, `rgba(100, 70, 30, ${Math.random() * 0.1})`)
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
}

// --- Pretext-powered line-by-line layout with dragon obstacle ---

// Check if a horizontal line at yTop..yBottom overlaps the dragon circle
// Returns the available width intervals (left side or right side of dragon)
function getLineAvailableWidth(lineTop, lineBottom, blockLeft, blockWidth, dragonRect) {
  if (!dragonRect) return [{ left: blockLeft, width: blockWidth }]

  const dTop = dragonRect.top - dragon.padding
  const dBottom = dragonRect.bottom + dragon.padding
  const dLeft = dragonRect.left - dragon.padding
  const dRight = dragonRect.right + dragon.padding

  // No vertical overlap
  if (lineBottom <= dTop || lineTop >= dBottom) {
    return [{ left: blockLeft, width: blockWidth }]
  }

  const blockRight = blockLeft + blockWidth

  // No horizontal overlap
  if (dLeft >= blockRight || dRight <= blockLeft) {
    return [{ left: blockLeft, width: blockWidth }]
  }

  // Dragon is in the way — figure out which side has more space
  const leftSpace = Math.max(0, dLeft - blockLeft)
  const rightSpace = Math.max(0, blockRight - dRight)

  if (leftSpace >= rightSpace && leftSpace > 60) {
    return [{ left: blockLeft, width: leftSpace }]
  } else if (rightSpace > 60) {
    return [{ left: dRight, width: rightSpace }]
  } else if (leftSpace > 30) {
    return [{ left: blockLeft, width: leftSpace }]
  } else {
    // Dragon covers nearly all — push text below
    return []
  }
}

// Lay out text using Pretext's layoutNextLine, flowing around the dragon
function layoutAroundDragon(text, font, lineHeight, blockTop, blockLeft, blockWidth, dragonRect) {
  const prepared = prepareWithSegments(text, font)
  const lines = []
  let cursor = { segmentIndex: 0, graphemeIndex: 0 }
  let y = blockTop

  for (let safety = 0; safety < 500; safety++) {
    const intervals = getLineAvailableWidth(y, y + lineHeight, blockLeft, blockWidth, dragonRect)

    if (intervals.length === 0) {
      // Skip this line height — dragon blocks it entirely
      y += lineHeight
      continue
    }

    const interval = intervals[0]
    const line = layoutNextLine(prepared, cursor, interval.width)
    if (line === null) break

    lines.push({
      text: line.text,
      width: line.width,
      x: interval.left,
      y: y,
    })

    cursor = line.end
    y += lineHeight
  }

  return { lines, height: y - blockTop }
}

// --- Collect all rendered blocks for relayout ---
let renderedBlocks = []
let manuscriptEl = null
let contentWidth = 0

function getContentWidth() {
  const parchment = document.getElementById('parchment')
  const style = getComputedStyle(parchment)
  return parchment.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
}

function getDragonRect() {
  if (!dragon.el || !manuscriptEl) return null
  const mRect = manuscriptEl.getBoundingClientRect()
  return {
    left: dragon.x,
    top: dragon.y,
    right: dragon.x + DRAGON_WIDTH,
    bottom: dragon.y + DRAGON_HEIGHT,
    // relative to manuscript
    relLeft: dragon.x - mRect.left + manuscriptEl.scrollLeft,
    relTop: dragon.y - mRect.top + manuscriptEl.scrollTop,
  }
}

// --- Rendering ---

function render() {
  manuscriptEl = document.getElementById('manuscript')
  manuscriptEl.innerHTML = ''
  renderedBlocks = []
  contentWidth = getContentWidth()

  const narrowWidth = Math.min(contentWidth * 0.78, contentWidth - 40)
  const shortWidth = Math.min(contentWidth * 0.62, contentWidth - 80)

  for (const block of storyBlocks) {
    switch (block.type) {
      case 'title': renderTitle(block); break
      case 'subtitle': renderSubtitle(block); break
      case 'separator': renderSeparator(); break
      case 'body': renderBody(block, narrowWidth, shortWidth); break
      case 'highlight': renderHighlight(block); break
      case 'quote': renderQuote(block); break
      case 'note': renderNote(block); break
      case 'list': renderList(block); break
      case 'warning': renderWarning(block); break
      case 'colophon': renderColophon(block); break
    }
  }

  // After initial render, do a relayout pass with dragon position
  requestAnimationFrame(() => relayoutWithDragon())
}

function registerBlock(el, blockData) {
  renderedBlocks.push({ el, ...blockData })
}

function renderTitle(block) {
  const result = layoutWithLines(
    prepareWithSegments(block.text, TITLE_FONT),
    contentWidth, TITLE_LINE_HEIGHT
  )
  const el = document.createElement('div')
  el.className = 'ms-title'
  result.lines.forEach(line => {
    const d = document.createElement('div')
    d.textContent = line.text
    el.appendChild(d)
  })
  manuscriptEl.appendChild(el)
}

function renderSubtitle(block) {
  const result = layoutWithLines(
    prepareWithSegments(block.text, SUBTITLE_FONT, { whiteSpace: 'pre-wrap' }),
    contentWidth * 0.82, SUBTITLE_LINE_HEIGHT
  )
  const el = document.createElement('div')
  el.className = 'ms-subtitle'
  result.lines.forEach(line => {
    const d = document.createElement('div')
    d.textContent = line.text
    el.appendChild(d)
  })
  manuscriptEl.appendChild(el)
}

function renderSeparator() {
  const el = document.createElement('div')
  el.className = 'ms-separator'
  el.textContent = '\u2726 \u2726 \u2726'
  manuscriptEl.appendChild(el)
}

function renderBody(block, narrowWidth, shortWidth) {
  let maxWidth = contentWidth
  let cssClass = 'ms-paragraph'

  if (block.width === 'narrow') { maxWidth = narrowWidth; cssClass = 'ms-paragraph-narrow' }
  else if (block.width === 'short') { maxWidth = shortWidth; cssClass = 'ms-paragraph-short' }

  const wrapper = document.createElement('div')
  wrapper.className = cssClass

  if (block.initial) {
    const initialEl = document.createElement('span')
    initialEl.className = 'ms-initial'
    initialEl.textContent = block.initial
    wrapper.appendChild(initialEl)
  }

  // Create a container for Pretext-laid-out lines
  const linesContainer = document.createElement('div')
  linesContainer.className = 'ms-body pt-lines-container'
  wrapper.appendChild(linesContainer)

  if (block.marginal) {
    const marginal = document.createElement('div')
    marginal.className = block.marginal.side === 'left' ? 'ms-marginal-left' : 'ms-marginal'
    marginal.textContent = block.marginal.text
    wrapper.appendChild(marginal)
  }

  manuscriptEl.appendChild(wrapper)

  // Register for relayout
  registerBlock(linesContainer, {
    type: 'body',
    text: block.text,
    font: BODY_FONT,
    lineHeight: BODY_LINE_HEIGHT,
    maxWidth: maxWidth,
  })

  // Initial layout without dragon
  layoutBlockLines(linesContainer, block.text, BODY_FONT, BODY_LINE_HEIGHT, maxWidth, null)
}

function renderHighlight(block) {
  const el = document.createElement('div')
  el.className = 'ms-highlight-line'

  const linesContainer = document.createElement('div')
  linesContainer.className = 'pt-lines-container'
  el.appendChild(linesContainer)

  manuscriptEl.appendChild(el)

  registerBlock(linesContainer, {
    type: 'highlight',
    text: block.text,
    font: HIGHLIGHT_FONT,
    lineHeight: HIGHLIGHT_LINE_HEIGHT,
    maxWidth: contentWidth * 0.88,
  })

  layoutBlockLines(linesContainer, block.text, HIGHLIGHT_FONT, HIGHLIGHT_LINE_HEIGHT, contentWidth * 0.88, null)
}

function renderQuote(block) {
  const el = document.createElement('div')
  el.className = 'ms-quote'

  const linesContainer = document.createElement('div')
  linesContainer.className = 'pt-lines-container'
  el.appendChild(linesContainer)

  if (block.attribution) {
    const attr = document.createElement('div')
    attr.className = 'ms-quote-attribution'
    attr.textContent = block.attribution
    el.appendChild(attr)
  }

  manuscriptEl.appendChild(el)

  const quoteWidth = contentWidth - 110
  registerBlock(linesContainer, {
    type: 'quote',
    text: block.text,
    font: BODY_ITALIC_FONT,
    lineHeight: BODY_LINE_HEIGHT,
    maxWidth: quoteWidth,
  })

  layoutBlockLines(linesContainer, block.text, BODY_ITALIC_FONT, BODY_LINE_HEIGHT, quoteWidth, null)
}

function renderNote(block) {
  const el = document.createElement('div')
  el.className = 'ms-note'

  const linesContainer = document.createElement('div')
  linesContainer.className = 'pt-lines-container'
  el.appendChild(linesContainer)

  manuscriptEl.appendChild(el)

  const noteWidth = contentWidth - 100
  registerBlock(linesContainer, {
    type: 'note',
    text: block.text,
    font: NOTE_FONT,
    lineHeight: NOTE_LINE_HEIGHT,
    maxWidth: noteWidth,
  })

  layoutBlockLines(linesContainer, block.text, NOTE_FONT, NOTE_LINE_HEIGHT, noteWidth, null)
}

function renderList(block) {
  const el = document.createElement('div')
  el.className = 'ms-list'

  block.items.forEach(item => {
    const li = document.createElement('div')
    li.className = 'ms-list-item'

    const linesContainer = document.createElement('div')
    linesContainer.className = 'pt-lines-container'
    li.appendChild(linesContainer)
    el.appendChild(li)

    const listWidth = contentWidth - 70
    registerBlock(linesContainer, {
      type: 'list-item',
      text: item,
      font: LIST_FONT,
      lineHeight: LIST_LINE_HEIGHT,
      maxWidth: listWidth,
    })

    layoutBlockLines(linesContainer, item, LIST_FONT, LIST_LINE_HEIGHT, listWidth, null)
  })

  manuscriptEl.appendChild(el)
}

function renderWarning(block) {
  const el = document.createElement('div')
  el.className = 'ms-warning'

  const parts = block.text.split('\n\n')
  if (parts.length > 1) {
    const header = document.createElement('div')
    header.style.fontWeight = '700'
    header.style.letterSpacing = '3px'
    header.style.marginBottom = '12px'
    header.style.fontSize = '1.1em'
    header.textContent = parts[0]
    el.appendChild(header)

    const linesContainer = document.createElement('div')
    linesContainer.className = 'pt-lines-container'
    el.appendChild(linesContainer)

    manuscriptEl.appendChild(el)

    const warnWidth = contentWidth - 80
    registerBlock(linesContainer, {
      type: 'warning',
      text: parts[1],
      font: WARNING_FONT,
      lineHeight: WARNING_LINE_HEIGHT,
      maxWidth: warnWidth,
    })

    layoutBlockLines(linesContainer, parts[1], WARNING_FONT, WARNING_LINE_HEIGHT, warnWidth, null)
  } else {
    el.textContent = block.text
    manuscriptEl.appendChild(el)
  }
}

function renderColophon(block) {
  const el = document.createElement('div')
  el.className = 'ms-colophon'

  const result = layoutWithLines(
    prepareWithSegments(block.text, COLOPHON_FONT, { whiteSpace: 'pre-wrap' }),
    contentWidth * 0.72, COLOPHON_LINE_HEIGHT
  )
  result.lines.forEach(line => {
    const d = document.createElement('div')
    d.textContent = line.text
    el.appendChild(d)
  })

  manuscriptEl.appendChild(el)
}

// --- Layout lines into a container, optionally flowing around dragon ---

function layoutBlockLines(container, text, font, lineHeight, maxWidth, dragonRect) {
  container.innerHTML = ''

  if (dragonRect) {
    const cRect = container.getBoundingClientRect()
    const scrollContainer = document.getElementById('scroll-container')
    const scrollTop = scrollContainer.scrollTop
    const blockTop = cRect.top + scrollTop
    const blockLeft = cRect.left

    const result = layoutAroundDragon(
      text, font, lineHeight,
      blockTop, blockLeft, maxWidth,
      {
        left: dragonRect.left,
        top: dragonRect.top + scrollTop,
        right: dragonRect.right,
        bottom: dragonRect.bottom + scrollTop,
      }
    )

    result.lines.forEach(line => {
      const d = document.createElement('div')
      d.className = 'pt-line'
      d.style.font = font
      d.style.lineHeight = lineHeight + 'px'
      // Offset from block position
      const offsetX = line.x - blockLeft
      if (Math.abs(offsetX) > 1) {
        d.style.marginLeft = offsetX + 'px'
      }
      d.textContent = line.text
      container.appendChild(d)
    })
  } else {
    // Standard layout without dragon
    const prepared = prepareWithSegments(text, font)
    const result = layoutWithLines(prepared, maxWidth, lineHeight)
    result.lines.forEach(line => {
      const d = document.createElement('div')
      d.className = 'pt-line'
      d.style.font = font
      d.style.lineHeight = lineHeight + 'px'
      d.textContent = line.text
      container.appendChild(d)
    })
  }
}

// --- Relayout all registered blocks with current dragon position ---

let relayoutRAF = null

function relayoutWithDragon() {
  const dragonRect = dragon.el ? dragon.el.getBoundingClientRect() : null

  for (const block of renderedBlocks) {
    layoutBlockLines(
      block.el, block.text, block.font,
      block.lineHeight, block.maxWidth,
      dragonRect
    )
  }
}

function scheduleRelayout() {
  if (relayoutRAF) return
  relayoutRAF = requestAnimationFrame(() => {
    relayoutRAF = null
    relayoutWithDragon()
  })
}

// --- Dragon drag handling (mobile-first: touch + mouse) ---

function initDragon() {
  const scrollContainer = document.getElementById('scroll-container')
  const parchment = document.getElementById('parchment')

  const dragonEl = document.createElement('div')
  dragonEl.id = 'dragon'
  dragonEl.setAttribute('role', 'img')
  dragonEl.setAttribute('aria-label', 'Mittelalterlicher Drache — ziehe mich über den Text')
  dragonEl.appendChild(createDragonSVG())
  document.body.appendChild(dragonEl)
  dragon.el = dragonEl

  // Position dragon initially at top-right of parchment
  const pRect = parchment.getBoundingClientRect()
  dragon.x = pRect.right - DRAGON_WIDTH - 30
  dragon.y = pRect.top + 60
  updateDragonPosition()

  // --- Touch events (primary for mobile) ---
  dragonEl.addEventListener('touchstart', (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    dragon.dragging = true
    dragon.offsetX = touch.clientX - dragon.x
    dragon.offsetY = touch.clientY - dragon.y
    dragonEl.classList.add('dragging')
  }, { passive: false })

  document.addEventListener('touchmove', (e) => {
    if (!dragon.dragging) return
    e.preventDefault()
    const touch = e.touches[0]
    dragon.x = touch.clientX - dragon.offsetX
    dragon.y = touch.clientY - dragon.offsetY
    updateDragonPosition()
    scheduleRelayout()
  }, { passive: false })

  document.addEventListener('touchend', () => {
    if (!dragon.dragging) return
    dragon.dragging = false
    dragonEl.classList.remove('dragging')
    scheduleRelayout()
  })

  // --- Mouse events ---
  dragonEl.addEventListener('mousedown', (e) => {
    e.preventDefault()
    dragon.dragging = true
    dragon.offsetX = e.clientX - dragon.x
    dragon.offsetY = e.clientY - dragon.y
    dragonEl.classList.add('dragging')
  })

  document.addEventListener('mousemove', (e) => {
    if (!dragon.dragging) return
    dragon.x = e.clientX - dragon.offsetX
    dragon.y = e.clientY - dragon.offsetY
    updateDragonPosition()
    scheduleRelayout()
  })

  document.addEventListener('mouseup', () => {
    if (!dragon.dragging) return
    dragon.dragging = false
    dragonEl.classList.remove('dragging')
    scheduleRelayout()
  })

  // Keep dragon position updated on scroll
  scrollContainer.addEventListener('scroll', () => {
    if (!dragon.dragging) {
      scheduleRelayout()
    }
  }, { passive: true })
}

function updateDragonPosition() {
  dragon.el.style.transform = `translate(${dragon.x}px, ${dragon.y}px)`
}

// --- Init ---

function init() {
  document.fonts.ready.then(() => {
    const textureCanvas = document.getElementById('texture-canvas')
    generateParchmentTexture(textureCanvas)

    render()
    initDragon()

    let resizeTimer
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        generateParchmentTexture(textureCanvas)
        render()
        // Reposition dragon within view
        const pRect = document.getElementById('parchment').getBoundingClientRect()
        if (dragon.x > pRect.right - 40) dragon.x = pRect.right - DRAGON_WIDTH - 20
        if (dragon.x < pRect.left) dragon.x = pRect.left + 20
        updateDragonPosition()
        scheduleRelayout()
      }, 200)
    })
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
