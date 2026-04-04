import {
  prepareWithSegments,
  layoutWithLines,
  layoutNextLine,
} from '@chenglou/pretext'
import { storyBlocks } from './story.js'
import { createSternElement, STERN_SIZE } from './dragon.js'

// =============================================
// Font config
// =============================================

const BODY_FONT = '18px "IM Fell English", "Palatino Linotype", "Book Antiqua", Palatino, serif'
const BODY_ITALIC_FONT = 'italic 18px "IM Fell DW Pica", "Palatino Linotype", serif'
const TITLE_FONT = '32px "Uncial Antiqua", serif'
const SUBTITLE_FONT = 'italic 15px "IM Fell DW Pica", serif'
const HIGHLIGHT_FONT = '19px "IM Fell Great Primer", "Palatino Linotype", serif'
const NOTE_FONT = 'italic 15px "IM Fell DW Pica", serif'
const LIST_FONT = '16px "IM Fell English", "Palatino Linotype", serif'
const WARNING_FONT = '17px "IM Fell Great Primer", "Palatino Linotype", serif'
const COLOPHON_FONT = 'italic 15px "IM Fell DW Pica", serif'

const BODY_LH = 31
const TITLE_LH = 42
const SUBTITLE_LH = 24
const HIGHLIGHT_LH = 32
const NOTE_LH = 26
const LIST_LH = 28
const WARNING_LH = 30
const COLOPHON_LH = 26

const CONTOUR_PAD = 3
const MIN_SLOT_WIDTH = 30

// =============================================
// Marker state + contour
// =============================================

const stern = {
  x: 0, y: 0,
  el: null,
  dragging: false,
  offsetX: 0, offsetY: 0,
  contour: null, // array of {left,right}|null per pixel-row
  rotation: 0,   // current rotation in degrees
  prevX: 0, prevY: 0, // previous position for velocity calc
}

// =============================================
// Parchment texture
// =============================================

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
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const n = Math.random() * 55
    d[i] = n; d[i+1] = n * 0.8; d[i+2] = n * 0.5; d[i+3] = Math.random() * 25
  }
  ctx.putImageData(imageData, 0, 0)
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * w, y = Math.random() * h, r = Math.random() * 40 + 5
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(100,70,30,${Math.random()*0.1})`)
    g.addColorStop(1, 'transparent')
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
}

// =============================================
// Contour scanning (SVG → per-row left/right)
// =============================================

function computeContour(svgElement) {
  const canvas = document.createElement('canvas')
  const w = STERN_SIZE
  const h = STERN_SIZE
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const svgClone = svgElement.cloneNode(true)
  svgClone.setAttribute('width', w)
  svgClone.setAttribute('height', h)
  const svgData = new XMLSerializer().serializeToString(svgClone)
  const img = new Image()
  img.width = w
  img.height = h

  return new Promise((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h)
      const imageData = ctx.getImageData(0, 0, w, h)
      const data = imageData.data
      const contour = []
      for (let y = 0; y < h; y++) {
        let left = -1, right = -1
        for (let x = 0; x < w; x++) {
          if (data[(y * w + x) * 4 + 3] > 20) {
            if (left === -1) left = x
            right = x
          }
        }
        contour.push(left === -1 ? null : {
          left: Math.max(0, left - CONTOUR_PAD),
          right: Math.min(w, right + CONTOUR_PAD + 1),
        })
      }
      resolve(contour)
    }
    img.onerror = () => {
      const contour = []
      for (let y = 0; y < h; y++) contour.push({ left: 0, right: w })
      resolve(contour)
    }
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData)
  })
}

// =============================================
// Slot carving (editorial-engine pattern)
// =============================================

// Given a base interval and blocked intervals, return remaining slots
function carveSlots(base, blocked) {
  let slots = [base]
  for (const interval of blocked) {
    const next = []
    for (const slot of slots) {
      if (interval.right <= slot.left || interval.left >= slot.right) {
        next.push(slot)
        continue
      }
      if (interval.left > slot.left) next.push({ left: slot.left, right: interval.left })
      if (interval.right < slot.right) next.push({ left: interval.right, right: slot.right })
    }
    slots = next
  }
  return slots.filter(s => (s.right - s.left) >= MIN_SLOT_WIDTH)
}

// Get the blocked interval from the marker contour for a given line band
function getContourBlockedInterval(bandTop, bandBottom) {
  const contour = stern.contour
  if (!contour) return null

  const scrollTop = document.getElementById('scroll-container').scrollTop
  const markerAbsY = stern.y + scrollTop

  const localTop = Math.floor(bandTop - markerAbsY)
  const localBot = Math.ceil(bandBottom - markerAbsY)

  if (localBot <= 0 || localTop >= contour.length) return null

  let minLeft = Infinity, maxRight = -Infinity, hit = false
  const startY = Math.max(0, localTop)
  const endY = Math.min(contour.length, localBot)

  for (let y = startY; y < endY; y++) {
    const row = contour[y]
    if (row) {
      if (row.left < minLeft) minLeft = row.left
      if (row.right > maxRight) maxRight = row.right
      hit = true
    }
  }

  if (!hit) return null
  return { left: stern.x + minLeft, right: stern.x + maxRight }
}

// =============================================
// Pretext layout with slot carving
// =============================================

// Lay out a text block: for each line, carve available slots around obstacles,
// then fill slots with text using layoutNextLine (text flows both sides).
// rectObstacles: array of {left, top, right, bottom} in absolute coords
function layoutTextBlock(prepared, regionLeft, regionTop, regionWidth, lineHeight, rectObstacles) {
  let cursor = { segmentIndex: 0, graphemeIndex: 0 }
  let y = regionTop
  const lines = []
  const regionRight = regionLeft + regionWidth

  for (let safe = 0; safe < 600; safe++) {
    const bandTop = y
    const bandBottom = y + lineHeight

    // Collect all blocked intervals
    const blocked = []

    // Stern contour
    const sternInterval = getContourBlockedInterval(bandTop, bandBottom)
    if (sternInterval) blocked.push(sternInterval)

    // Rect obstacles (e.g. drop cap)
    if (rectObstacles) {
      for (const rect of rectObstacles) {
        if (bandBottom <= rect.top || bandTop >= rect.bottom) continue
        blocked.push({ left: rect.left, right: rect.right })
      }
    }

    // Carve available slots
    const slots = carveSlots({ left: regionLeft, right: regionRight }, blocked)

    if (slots.length === 0) {
      y += lineHeight
      continue
    }

    // Sort slots left-to-right and fill each with text
    slots.sort((a, b) => a.left - b.left)

    let textExhausted = false
    for (const slot of slots) {
      const slotWidth = slot.right - slot.left
      const line = layoutNextLine(prepared, cursor, slotWidth)
      if (line === null) { textExhausted = true; break }

      lines.push({
        text: line.text,
        x: Math.round(slot.left),
        y: Math.round(y),
        width: line.width,
      })
      cursor = line.end
    }

    if (textExhausted) break
    y += lineHeight
  }

  return { lines, height: y - regionTop }
}

// =============================================
// Block registry + relayout
// =============================================

let registeredBlocks = []
let manuscriptEl = null
let contentWidth = 0

function getContentWidth() {
  const p = document.getElementById('parchment')
  const s = getComputedStyle(p)
  return p.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)
}

// Render a text block's lines as absolutely-positioned spans (editorial-engine pattern)
// Measure drop cap element and return a rect obstacle in absolute coords
function measureDropCap(initialEl, lineHeight) {
  if (!initialEl || !initialEl.parentElement) return null
  const rect = initialEl.getBoundingClientRect()
  if (rect.width === 0) return null
  const scrollTop = document.getElementById('scroll-container').scrollTop
  return [{
    left: rect.left - 2,
    top: rect.top + scrollTop - 2,
    right: rect.right + 4,
    bottom: rect.top + scrollTop + lineHeight * 3 + 4,
  }]
}

function layoutBlockLines(container, text, font, lineHeight, maxWidth, useContour, initialEl) {
  // Guard: skip if width is invalid
  if (maxWidth < 30) return

  // Remove all children EXCEPT the initial element
  const children = Array.from(container.children)
  for (const child of children) {
    if (child !== initialEl) container.removeChild(child)
  }

  const prepared = prepareWithSegments(text, font)

  if (useContour && stern.contour) {
    const cRect = container.getBoundingClientRect()
    const scrollTop = document.getElementById('scroll-container').scrollTop
    const blockTop = cRect.top + scrollTop
    const blockLeft = cRect.left

    // Live-measure drop cap for rect obstacle
    const rectObstacles = measureDropCap(initialEl, lineHeight)

    const result = layoutTextBlock(prepared, blockLeft, blockTop, maxWidth, lineHeight, rectObstacles)

    container.style.height = result.height + 'px'
    container.style.position = 'relative'

    for (const line of result.lines) {
      const span = document.createElement('span')
      span.className = 'pt-line'
      span.style.font = font
      span.style.lineHeight = lineHeight + 'px'
      span.style.left = (line.x - blockLeft) + 'px'
      span.style.top = (line.y - blockTop) + 'px'
      span.textContent = line.text
      container.appendChild(span)
    }
  } else {
    const result = layoutWithLines(prepared, maxWidth, lineHeight)
    container.style.height = ''
    container.style.position = ''

    for (const line of result.lines) {
      const d = document.createElement('div')
      d.className = 'pt-line-static'
      d.style.font = font
      d.style.lineHeight = lineHeight + 'px'
      d.textContent = line.text
      container.appendChild(d)
    }
  }
}

function relayoutAll() {
  const useContour = !!stern.contour
  for (const b of registeredBlocks) {
    layoutBlockLines(b.el, b.text, b.font, b.lineHeight, b.maxWidth, useContour, b.initialEl || null)
  }
}

let relayoutRAF = null
function scheduleRelayout() {
  if (relayoutRAF) return
  relayoutRAF = requestAnimationFrame(() => {
    relayoutRAF = null
    relayoutAll()
  })
}

// =============================================
// Rendering story blocks
// =============================================

function render() {
  manuscriptEl = document.getElementById('manuscript')
  manuscriptEl.innerHTML = ''
  registeredBlocks = []
  contentWidth = getContentWidth()

  // Guard: if layout isn't ready yet, retry after a frame
  if (contentWidth < 100) {
    requestAnimationFrame(() => render())
    return
  }

  const narrowW = Math.min(contentWidth * 0.78, contentWidth - 40)
  const shortW = Math.min(contentWidth * 0.62, contentWidth - 80)

  for (const block of storyBlocks) {
    switch (block.type) {
      case 'title':     renderTitle(block); break
      case 'subtitle':  renderSubtitle(block); break
      case 'separator': renderSeparator(); break
      case 'body':      renderBody(block, narrowW, shortW); break
      case 'highlight': renderHighlight(block); break
      case 'quote':     renderQuote(block); break
      case 'note':      renderNote(block); break
      case 'list':      renderList(block); break
      case 'warning':   renderWarning(block); break
      case 'colophon':  renderColophon(block); break
    }
  }

  requestAnimationFrame(() => relayoutAll())
}

function registerBlock(el, data) {
  registeredBlocks.push({ el, ...data })
}

function renderTitle(block) {
  const res = layoutWithLines(prepareWithSegments(block.text, TITLE_FONT), contentWidth, TITLE_LH)
  const el = document.createElement('div')
  el.className = 'ms-title'
  for (const l of res.lines) { const d = document.createElement('div'); d.textContent = l.text; el.appendChild(d) }
  manuscriptEl.appendChild(el)
}

function renderSubtitle(block) {
  const res = layoutWithLines(prepareWithSegments(block.text, SUBTITLE_FONT, { whiteSpace: 'pre-wrap' }), contentWidth * 0.82, SUBTITLE_LH)
  const el = document.createElement('div')
  el.className = 'ms-subtitle'
  for (const l of res.lines) { const d = document.createElement('div'); d.textContent = l.text; el.appendChild(d) }
  manuscriptEl.appendChild(el)
}

function renderSeparator() {
  const el = document.createElement('div')
  el.className = 'ms-separator'
  el.textContent = '\u2726 \u2726 \u2726'
  manuscriptEl.appendChild(el)
}

function renderBody(block, narrowW, shortW) {
  let maxW = contentWidth, cls = 'ms-paragraph'
  if (block.width === 'narrow') { maxW = narrowW; cls = 'ms-paragraph-narrow' }
  else if (block.width === 'short') { maxW = shortW; cls = 'ms-paragraph-short' }

  const wrapper = document.createElement('div')
  wrapper.className = cls

  // Drop cap is placed inside the lines container so it's measured relative to it
  const lc = document.createElement('div')
  lc.className = 'ms-body pt-lines-container'

  let iniEl = null
  if (block.initial) {
    iniEl = document.createElement('span')
    iniEl.className = 'ms-initial'
    iniEl.textContent = block.initial
    lc.appendChild(iniEl)
  }

  wrapper.appendChild(lc)

  if (block.marginal) {
    const m = document.createElement('div')
    m.className = block.marginal.side === 'left' ? 'ms-marginal-left' : 'ms-marginal'
    m.textContent = block.marginal.text
    wrapper.appendChild(m)
  }

  manuscriptEl.appendChild(wrapper)

  // Store reference to initial element for live measurement during relayout
  registerBlock(lc, {
    text: block.text,
    font: BODY_FONT,
    lineHeight: BODY_LH,
    maxWidth: maxW,
    initialEl: iniEl,
  })
  layoutBlockLines(lc, block.text, BODY_FONT, BODY_LH, maxW, null, null)
}

function renderHighlight(block) {
  const el = document.createElement('div')
  el.className = 'ms-highlight-line'
  const lc = document.createElement('div')
  lc.className = 'pt-lines-container'
  el.appendChild(lc)
  manuscriptEl.appendChild(el)
  const mw = contentWidth * 0.88
  registerBlock(lc, { text: block.text, font: HIGHLIGHT_FONT, lineHeight: HIGHLIGHT_LH, maxWidth: mw })
  layoutBlockLines(lc, block.text, HIGHLIGHT_FONT, HIGHLIGHT_LH, mw, null)
}

function renderQuote(block) {
  const el = document.createElement('div')
  el.className = 'ms-quote'
  const lc = document.createElement('div')
  lc.className = 'pt-lines-container'
  el.appendChild(lc)
  if (block.attribution) {
    const a = document.createElement('div')
    a.className = 'ms-quote-attribution'
    a.textContent = block.attribution
    el.appendChild(a)
  }
  manuscriptEl.appendChild(el)
  const mw = contentWidth - 110
  registerBlock(lc, { text: block.text, font: BODY_ITALIC_FONT, lineHeight: BODY_LH, maxWidth: mw })
  layoutBlockLines(lc, block.text, BODY_ITALIC_FONT, BODY_LH, mw, null)
}

function renderNote(block) {
  const el = document.createElement('div')
  el.className = 'ms-note'
  const lc = document.createElement('div')
  lc.className = 'pt-lines-container'
  el.appendChild(lc)
  manuscriptEl.appendChild(el)
  const mw = contentWidth - 100
  registerBlock(lc, { text: block.text, font: NOTE_FONT, lineHeight: NOTE_LH, maxWidth: mw })
  layoutBlockLines(lc, block.text, NOTE_FONT, NOTE_LH, mw, null)
}

function renderList(block) {
  const el = document.createElement('div')
  el.className = 'ms-list'
  for (const item of block.items) {
    const li = document.createElement('div')
    li.className = 'ms-list-item'
    const lc = document.createElement('div')
    lc.className = 'pt-lines-container'
    li.appendChild(lc)
    el.appendChild(li)
    const mw = contentWidth - 70
    registerBlock(lc, { text: item, font: LIST_FONT, lineHeight: LIST_LH, maxWidth: mw })
    layoutBlockLines(lc, item, LIST_FONT, LIST_LH, mw, null)
  }
  manuscriptEl.appendChild(el)
}

function renderWarning(block) {
  const el = document.createElement('div')
  el.className = 'ms-warning'
  const parts = block.text.split('\n\n')
  if (parts.length > 1) {
    const hdr = document.createElement('div')
    hdr.style.cssText = 'font-weight:700;letter-spacing:3px;margin-bottom:12px;font-size:1.1em'
    hdr.textContent = parts[0]
    el.appendChild(hdr)
    const lc = document.createElement('div')
    lc.className = 'pt-lines-container'
    el.appendChild(lc)
    manuscriptEl.appendChild(el)
    const mw = contentWidth - 80
    registerBlock(lc, { text: parts[1], font: WARNING_FONT, lineHeight: WARNING_LH, maxWidth: mw })
    layoutBlockLines(lc, parts[1], WARNING_FONT, WARNING_LH, mw, null)
  } else {
    el.textContent = block.text
    manuscriptEl.appendChild(el)
  }
}

function renderColophon(block) {
  const el = document.createElement('div')
  el.className = 'ms-colophon'
  const res = layoutWithLines(prepareWithSegments(block.text, COLOPHON_FONT, { whiteSpace: 'pre-wrap' }), contentWidth * 0.72, COLOPHON_LH)
  for (const l of res.lines) { const d = document.createElement('div'); d.textContent = l.text; el.appendChild(d) }
  manuscriptEl.appendChild(el)
}

// =============================================
// Stern: init + drag + rotation (touch-first)
// =============================================

function initStern() {
  const scrollContainer = document.getElementById('scroll-container')
  const parchment = document.getElementById('parchment')
  const pRect = parchment.getBoundingClientRect()

  const svgEl = createSternElement()
  const el = document.createElement('div')
  el.id = 'stern'
  el.setAttribute('role', 'img')
  el.setAttribute('aria-label', 'Stern — ziehe mich über den Text')
  el.appendChild(svgEl)
  document.body.appendChild(el)
  stern.el = el

  stern.x = pRect.right - STERN_SIZE - 20
  stern.y = pRect.top + 50
  stern.prevX = stern.x
  stern.prevY = stern.y
  updateSternPos()

  // Add drag hint (arrow + handwritten text)
  const hint = document.createElement('div')
  hint.id = 'drag-hint'
  hint.innerHTML = `
    <svg class="drag-hint-arrow" viewBox="0 0 60 80" width="36" height="48">
      <path d="M 30 2 Q 28 20 20 35 Q 15 42 8 48" fill="none" stroke="#6b1a0a" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 3 40 L 8 48 L 16 43" fill="none" stroke="#6b1a0a" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
    <span class="drag-hint-text">Zieh mich!</span>
  `
  el.appendChild(hint)

  // Hide hint after first drag
  function hideHint() {
    hint.style.opacity = '0'
    setTimeout(() => hint.remove(), 400)
  }

  computeContour(svgEl).then(contour => {
    stern.contour = contour
    scheduleRelayout()
  })

  function onDragStart(clientX, clientY) {
    hideHint()
    stern.dragging = true
    stern.offsetX = clientX - stern.x
    stern.offsetY = clientY - stern.y
    stern.prevX = stern.x
    stern.prevY = stern.y
    el.classList.add('dragging')
  }

  function onDragMove(clientX, clientY) {
    if (!stern.dragging) return
    const newX = clientX - stern.offsetX
    const newY = clientY - stern.offsetY

    // Rotation proportional to movement distance
    const dx = newX - stern.prevX
    const dy = newY - stern.prevY
    const dist = Math.sqrt(dx * dx + dy * dy)
    // Direction: clockwise when moving right, counter-clockwise left
    const dir = dx >= 0 ? 1 : -1
    stern.rotation += dir * dist * 0.5

    stern.prevX = newX
    stern.prevY = newY
    stern.x = newX
    stern.y = newY
    updateSternPos()
    scheduleRelayout()
  }

  function onDragEnd() {
    if (!stern.dragging) return
    stern.dragging = false
    el.classList.remove('dragging')
  }

  // --- Touch (mobile-first) ---
  el.addEventListener('touchstart', (e) => {
    e.preventDefault()
    const t = e.touches[0]
    onDragStart(t.clientX, t.clientY)
  }, { passive: false })

  document.addEventListener('touchmove', (e) => {
    if (!stern.dragging) return
    e.preventDefault()
    const t = e.touches[0]
    onDragMove(t.clientX, t.clientY)
  }, { passive: false })

  document.addEventListener('touchend', onDragEnd)

  // --- Mouse ---
  el.addEventListener('mousedown', (e) => {
    e.preventDefault()
    onDragStart(e.clientX, e.clientY)
  })

  document.addEventListener('mousemove', (e) => {
    if (!stern.dragging) return
    onDragMove(e.clientX, e.clientY)
  })

  document.addEventListener('mouseup', onDragEnd)

  scrollContainer.addEventListener('scroll', () => scheduleRelayout(), { passive: true })
}

function updateSternPos() {
  stern.el.style.transform = `translate(${stern.x}px, ${stern.y}px) rotate(${stern.rotation}deg)`
}

// =============================================
// Init
// =============================================

function init() {
  // Wait for fonts AND a small delay to ensure layout is ready
  document.fonts.ready.then(() => {
    // Extra frame delay to ensure CSS layout is computed
    requestAnimationFrame(() => {
      try {
        const textureCanvas = document.getElementById('texture-canvas')
        generateParchmentTexture(textureCanvas)
        render()
        initStern()
      } catch (e) {
        console.error('Init error:', e)
        // Fallback: show text without Pretext layout
        const m = document.getElementById('manuscript')
        if (m && m.children.length === 0) {
          m.style.font = '18px serif'
          m.style.color = '#2a1a08'
          m.textContent = 'Fehler beim Laden. Bitte Seite neu laden.'
        }
      }

      let resizeTimer
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          try {
            const textureCanvas = document.getElementById('texture-canvas')
            generateParchmentTexture(textureCanvas)
            render()
            const pRect = document.getElementById('parchment').getBoundingClientRect()
            if (stern.x > pRect.right - 40) stern.x = pRect.right - STERN_SIZE - 20
            if (stern.x < pRect.left - 50) stern.x = pRect.left + 20
            updateSternPos()
            scheduleRelayout()
          } catch (e) { console.error('Resize error:', e) }
        }, 200)
      })
    })
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
