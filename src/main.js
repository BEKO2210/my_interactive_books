import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'
import { storyBlocks } from './story.js'

// --- Font definitions ---
const BODY_FONT = '18px "IM Fell English", "Palatino Linotype", "Book Antiqua", Palatino, serif'
const BODY_ITALIC_FONT = 'italic 18px "IM Fell DW Pica", "Palatino Linotype", serif'
const TITLE_FONT = '32px "Uncial Antiqua", serif'
const SUBTITLE_FONT = 'italic 16px "IM Fell DW Pica", serif'
const HIGHLIGHT_FONT = '20px "IM Fell Great Primer", "Palatino Linotype", serif'
const NOTE_FONT = 'italic 16px "IM Fell DW Pica", serif'
const LIST_FONT = '17px "IM Fell English", "Palatino Linotype", serif'
const WARNING_FONT = '18px "IM Fell Great Primer", "Palatino Linotype", serif'
const COLOPHON_FONT = 'italic 16px "IM Fell DW Pica", serif'

const BODY_LINE_HEIGHT = 32
const TITLE_LINE_HEIGHT = 44
const SUBTITLE_LINE_HEIGHT = 26
const HIGHLIGHT_LINE_HEIGHT = 34
const NOTE_LINE_HEIGHT = 28
const LIST_LINE_HEIGHT = 30
const WARNING_LINE_HEIGHT = 32
const COLOPHON_LINE_HEIGHT = 28

// --- Parchment texture ---
function generateParchmentTexture(canvas) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width = canvas.offsetWidth * 2
  const h = canvas.height = canvas.offsetHeight * 2
  ctx.clearRect(0, 0, w, h)

  // Random noise for parchment grain
  const imageData = ctx.createImageData(w, h)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 60
    data[i] = noise
    data[i + 1] = noise * 0.8
    data[i + 2] = noise * 0.5
    data[i + 3] = Math.random() * 30
  }
  ctx.putImageData(imageData, 0, 0)

  // Age spots
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const r = Math.random() * 40 + 5
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
    gradient.addColorStop(0, `rgba(100, 70, 30, ${Math.random() * 0.12})`)
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }

  // Edge darkening
  const edgeGrad = ctx.createLinearGradient(0, 0, w * 0.08, 0)
  edgeGrad.addColorStop(0, 'rgba(80, 50, 20, 0.25)')
  edgeGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = edgeGrad
  ctx.fillRect(0, 0, w * 0.08, h)

  const edgeGrad2 = ctx.createLinearGradient(w, 0, w * 0.92, 0)
  edgeGrad2.addColorStop(0, 'rgba(80, 50, 20, 0.25)')
  edgeGrad2.addColorStop(1, 'transparent')
  ctx.fillStyle = edgeGrad2
  ctx.fillRect(w * 0.92, 0, w * 0.08, h)
}

// --- Pretext layout engine for specific blocks ---
// Uses Pretext's prepareWithSegments + layoutWithLines for precise text measurement
// then renders positioned DOM elements

function layoutTextBlock(text, font, maxWidth, lineHeight) {
  const prepared = prepareWithSegments(text, font)
  const result = layoutWithLines(prepared, maxWidth, lineHeight)
  return result
}

// --- Main rendering ---

function getContentWidth() {
  const parchment = document.getElementById('parchment')
  const style = getComputedStyle(parchment)
  const paddingLeft = parseFloat(style.paddingLeft)
  const paddingRight = parseFloat(style.paddingRight)
  return parchment.clientWidth - paddingLeft - paddingRight
}

function render() {
  const manuscript = document.getElementById('manuscript')
  manuscript.innerHTML = ''

  const contentWidth = getContentWidth()
  const narrowWidth = contentWidth * 0.75
  const shortWidth = contentWidth * 0.6

  for (const block of storyBlocks) {
    switch (block.type) {
      case 'title':
        renderTitle(manuscript, block, contentWidth)
        break
      case 'subtitle':
        renderSubtitle(manuscript, block, contentWidth)
        break
      case 'separator':
        renderSeparator(manuscript)
        break
      case 'body':
        renderBody(manuscript, block, contentWidth, narrowWidth, shortWidth)
        break
      case 'highlight':
        renderHighlight(manuscript, block, contentWidth)
        break
      case 'quote':
        renderQuote(manuscript, block, contentWidth)
        break
      case 'note':
        renderNote(manuscript, block, contentWidth)
        break
      case 'list':
        renderList(manuscript, block, contentWidth)
        break
      case 'warning':
        renderWarning(manuscript, block, contentWidth)
        break
      case 'colophon':
        renderColophon(manuscript, block, contentWidth)
        break
    }
  }
}

function renderTitle(container, block, maxWidth) {
  // Use Pretext to measure the title precisely
  const result = layoutTextBlock(block.text, TITLE_FONT, maxWidth, TITLE_LINE_HEIGHT)

  const el = document.createElement('div')
  el.className = 'ms-title pt-block'
  el.style.height = result.height + 'px'
  el.style.marginBottom = '6px'

  result.lines.forEach((line, i) => {
    const span = document.createElement('div')
    span.className = 'pt-line ms-title'
    span.style.fontSize = '32px'
    span.style.top = (i * TITLE_LINE_HEIGHT) + 'px'
    span.style.width = '100%'
    span.style.textAlign = 'center'
    span.textContent = line.text
    el.appendChild(span)
  })

  container.appendChild(el)
}

function renderSubtitle(container, block, maxWidth) {
  const result = layoutTextBlock(block.text, SUBTITLE_FONT, maxWidth * 0.8, SUBTITLE_LINE_HEIGHT)

  const el = document.createElement('div')
  el.className = 'ms-subtitle pt-block'
  el.style.height = result.height + 'px'

  result.lines.forEach((line, i) => {
    const span = document.createElement('div')
    span.className = 'pt-line'
    span.style.fontFamily = '"IM Fell DW Pica", serif'
    span.style.fontStyle = 'italic'
    span.style.fontSize = '16px'
    span.style.color = '#6a4a2a'
    span.style.top = (i * SUBTITLE_LINE_HEIGHT) + 'px'
    span.style.left = '50%'
    span.style.transform = 'translateX(-50%)'
    span.style.textAlign = 'center'
    span.textContent = line.text
    el.appendChild(span)
  })

  container.appendChild(el)
}

function renderSeparator(container) {
  const el = document.createElement('div')
  el.className = 'ms-separator'
  el.textContent = '\u2726 \u2726 \u2726'
  container.appendChild(el)
}

function renderBody(container, block, contentWidth, narrowWidth, shortWidth) {
  let maxWidth = contentWidth
  let cssClass = 'ms-paragraph'

  if (block.width === 'narrow') {
    maxWidth = narrowWidth
    cssClass = 'ms-paragraph-narrow'
  } else if (block.width === 'short') {
    maxWidth = shortWidth
    cssClass = 'ms-paragraph-short'
  }

  // Measure with Pretext
  const result = layoutTextBlock(block.text, BODY_FONT, maxWidth, BODY_LINE_HEIGHT)

  const wrapper = document.createElement('div')
  wrapper.className = cssClass + ' pt-block'
  wrapper.style.position = 'relative'

  // For drop-cap initial, measure remaining text differently
  if (block.initial) {
    const initialEl = document.createElement('span')
    initialEl.className = 'ms-initial'
    initialEl.textContent = block.initial
    wrapper.appendChild(initialEl)
  }

  // Render Pretext-measured lines as DOM elements
  const textEl = document.createElement('div')
  textEl.className = 'ms-body'
  textEl.style.fontSize = '18px'

  // Use Pretext lines for the actual text display
  const fullText = block.initial ? block.initial + block.text : block.text
  textEl.textContent = block.text
  wrapper.appendChild(textEl)

  // Marginal notes
  if (block.marginal) {
    const marginal = document.createElement('div')
    marginal.className = block.marginal.side === 'left' ? 'ms-marginal-left' : 'ms-marginal'
    marginal.textContent = block.marginal.text
    marginal.style.top = '0'
    wrapper.appendChild(marginal)
  }

  // Add Pretext layout info as data attribute (for debugging / further use)
  wrapper.dataset.ptLines = result.lineCount
  wrapper.dataset.ptHeight = result.height

  container.appendChild(wrapper)
}

function renderHighlight(container, block, maxWidth) {
  const result = layoutTextBlock(block.text, HIGHLIGHT_FONT, maxWidth * 0.85, HIGHLIGHT_LINE_HEIGHT)

  const el = document.createElement('div')
  el.className = 'ms-highlight-line'
  el.dataset.ptLines = result.lineCount

  // Render individual Pretext-laid-out lines for precise control
  result.lines.forEach((line) => {
    const lineEl = document.createElement('div')
    lineEl.textContent = line.text
    el.appendChild(lineEl)
  })

  container.appendChild(el)
}

function renderQuote(container, block, maxWidth) {
  const quoteWidth = maxWidth - 90
  const result = layoutTextBlock(block.text, BODY_ITALIC_FONT, quoteWidth, BODY_LINE_HEIGHT)

  const el = document.createElement('div')
  el.className = 'ms-quote'
  el.dataset.ptLines = result.lineCount
  el.dataset.ptHeight = result.height

  const textEl = document.createElement('div')
  textEl.textContent = block.text
  el.appendChild(textEl)

  if (block.attribution) {
    const attr = document.createElement('span')
    attr.className = 'ms-quote-attribution'
    attr.textContent = block.attribution
    el.appendChild(attr)
  }

  container.appendChild(el)
}

function renderNote(container, block, maxWidth) {
  const noteWidth = maxWidth - 90
  const result = layoutTextBlock(block.text, NOTE_FONT, noteWidth, NOTE_LINE_HEIGHT)

  const el = document.createElement('div')
  el.className = 'ms-note'
  el.dataset.ptLines = result.lineCount
  el.textContent = block.text
  container.appendChild(el)
}

function renderList(container, block, maxWidth) {
  const el = document.createElement('div')
  el.className = 'ms-list'

  block.items.forEach((item) => {
    // Use Pretext to measure each list item
    const result = layoutTextBlock(item, LIST_FONT, maxWidth - 60, LIST_LINE_HEIGHT)

    const li = document.createElement('div')
    li.className = 'ms-list-item'
    li.dataset.ptLines = result.lineCount
    li.dataset.ptHeight = result.height
    li.textContent = item
    el.appendChild(li)
  })

  container.appendChild(el)
}

function renderWarning(container, block, maxWidth) {
  const result = layoutTextBlock(block.text, WARNING_FONT, maxWidth - 60, WARNING_LINE_HEIGHT)

  const el = document.createElement('div')
  el.className = 'ms-warning'
  el.dataset.ptLines = result.lineCount

  // Split at MONITVM header
  const parts = block.text.split('\n\n')
  if (parts.length > 1) {
    const header = document.createElement('div')
    header.style.fontWeight = '700'
    header.style.letterSpacing = '3px'
    header.style.marginBottom = '12px'
    header.style.fontSize = '1.1em'
    header.textContent = parts[0]
    el.appendChild(header)

    const body = document.createElement('div')
    body.textContent = parts[1]
    el.appendChild(body)
  } else {
    el.textContent = block.text
  }

  container.appendChild(el)
}

function renderColophon(container, block, maxWidth) {
  const result = layoutTextBlock(block.text, COLOPHON_FONT, maxWidth * 0.7, COLOPHON_LINE_HEIGHT)

  const el = document.createElement('div')
  el.className = 'ms-colophon'
  el.dataset.ptLines = result.lineCount

  result.lines.forEach((line) => {
    const lineEl = document.createElement('div')
    lineEl.textContent = line.text
    el.appendChild(lineEl)
  })

  container.appendChild(el)
}

// --- Init ---

function init() {
  // Wait for fonts to load
  document.fonts.ready.then(() => {
    // Generate parchment texture
    const textureCanvas = document.getElementById('texture-canvas')
    generateParchmentTexture(textureCanvas)

    // Render the manuscript
    render()

    // Re-render on resize (debounced)
    let resizeTimer
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        generateParchmentTexture(textureCanvas)
        render()
      }, 200)
    })
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
