import {
  prepareWithSegments,
  layoutWithLines,
  layoutNextLine,
} from '@chenglou/pretext'
import { storyBlocks } from './story.js'
import {
  createHeadSVG, createBodySVG, createTailSVG,
  startBlinking, SEGMENT_DIMS,
} from './dragon.js'

// =============================================
// Font definitions
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

// =============================================
// Dragon state — 3 segments with physics
// =============================================

const FOLLOW_SPEED = 0.12       // how fast segments follow (0–1)
const SEGMENT_SPACING = 8       // gap between segments in px
const DRAGON_PAD = 14           // text avoidance padding around each segment

const segments = [
  { x: 0, y: 0, targetX: 0, targetY: 0, el: null, dim: SEGMENT_DIMS[0] },
  { x: 0, y: 0, targetX: 0, targetY: 0, el: null, dim: SEGMENT_DIMS[1] },
  { x: 0, y: 0, targetX: 0, targetY: 0, el: null, dim: SEGMENT_DIMS[2] },
]

const dragState = {
  active: false,
  offsetX: 0,
  offsetY: 0,
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
// Pretext text layout with dragon obstacles
// =============================================

function getObstacleRects() {
  const scrollEl = document.getElementById('scroll-container')
  const scrollTop = scrollEl.scrollTop
  return segments.map(s => ({
    left:   s.x - DRAGON_PAD,
    top:    s.y + scrollTop - DRAGON_PAD,
    right:  s.x + s.dim.w + DRAGON_PAD,
    bottom: s.y + s.dim.h + scrollTop + DRAGON_PAD,
  }))
}

function lineAvailableWidth(lineTop, lineBot, blockLeft, blockWidth, obstacles) {
  let left = blockLeft
  let right = blockLeft + blockWidth

  for (const ob of obstacles) {
    if (lineBot <= ob.top || lineTop >= ob.bottom) continue
    if (ob.right <= left || ob.left >= right) continue

    // Obstacle overlaps this line — choose larger side
    const leftSpace = Math.max(0, ob.left - left)
    const rightSpace = Math.max(0, right - ob.right)

    if (leftSpace >= rightSpace && leftSpace > 50) {
      return { x: left, w: leftSpace }
    } else if (rightSpace > 50) {
      return { x: ob.right, w: rightSpace }
    } else {
      return null // blocked
    }
  }

  return { x: left, w: right - left }
}

function layoutAroundObstacles(text, font, lineHeight, blockTop, blockLeft, blockWidth, obstacles) {
  const prepared = prepareWithSegments(text, font)
  const lines = []
  let cursor = { segmentIndex: 0, graphemeIndex: 0 }
  let y = blockTop

  for (let safety = 0; safety < 500; safety++) {
    const avail = lineAvailableWidth(y, y + lineHeight, blockLeft, blockWidth, obstacles)

    if (!avail) {
      y += lineHeight
      continue
    }

    const line = layoutNextLine(prepared, cursor, avail.w)
    if (line === null) break

    lines.push({ text: line.text, width: line.width, x: avail.x, y })
    cursor = line.end
    y += lineHeight
  }

  return { lines, height: y - blockTop }
}

// =============================================
// Block registry for relayout
// =============================================

let registeredBlocks = []
let manuscriptEl = null
let contentWidth = 0

function getContentWidth() {
  const p = document.getElementById('parchment')
  const s = getComputedStyle(p)
  return p.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)
}

function layoutBlockLines(container, text, font, lineHeight, maxWidth, obstacles) {
  container.innerHTML = ''

  if (obstacles && obstacles.length) {
    const cRect = container.getBoundingClientRect()
    const scrollTop = document.getElementById('scroll-container').scrollTop
    const blockTop = cRect.top + scrollTop
    const blockLeft = cRect.left

    const result = layoutAroundObstacles(text, font, lineHeight, blockTop, blockLeft, maxWidth, obstacles)
    for (const line of result.lines) {
      const d = document.createElement('div')
      d.className = 'pt-line'
      d.style.font = font
      d.style.lineHeight = lineHeight + 'px'
      const offset = line.x - blockLeft
      if (Math.abs(offset) > 1) d.style.marginLeft = offset + 'px'
      d.textContent = line.text
      container.appendChild(d)
    }
  } else {
    const prepared = prepareWithSegments(text, font)
    const result = layoutWithLines(prepared, maxWidth, lineHeight)
    for (const line of result.lines) {
      const d = document.createElement('div')
      d.className = 'pt-line'
      d.style.font = font
      d.style.lineHeight = lineHeight + 'px'
      d.textContent = line.text
      container.appendChild(d)
    }
  }
}

function relayoutAll() {
  const obstacles = getObstacleRects()
  for (const b of registeredBlocks) {
    layoutBlockLines(b.el, b.text, b.font, b.lineHeight, b.maxWidth, obstacles)
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

  if (block.initial) {
    const ini = document.createElement('span')
    ini.className = 'ms-initial'
    ini.textContent = block.initial
    wrapper.appendChild(ini)
  }

  const lc = document.createElement('div')
  lc.className = 'ms-body pt-lines-container'
  wrapper.appendChild(lc)

  if (block.marginal) {
    const m = document.createElement('div')
    m.className = block.marginal.side === 'left' ? 'ms-marginal-left' : 'ms-marginal'
    m.textContent = block.marginal.text
    wrapper.appendChild(m)
  }

  manuscriptEl.appendChild(wrapper)
  registerBlock(lc, { text: block.text, font: BODY_FONT, lineHeight: BODY_LH, maxWidth: maxW })
  layoutBlockLines(lc, block.text, BODY_FONT, BODY_LH, maxW, null)
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
// Dragon: init, drag, physics
// =============================================

function initDragon() {
  const scrollContainer = document.getElementById('scroll-container')
  const parchment = document.getElementById('parchment')
  const pRect = parchment.getBoundingClientRect()

  // Create the 3 segment elements
  const creators = [createHeadSVG, createBodySVG, createTailSVG]
  const classes = ['dragon-head', 'dragon-body', 'dragon-tail']

  for (let i = 0; i < 3; i++) {
    const el = document.createElement('div')
    el.className = `dragon-segment ${classes[i]}`
    el.appendChild(creators[i]())
    document.body.appendChild(el)
    segments[i].el = el
  }

  // Initial position: stacked vertically at top-right
  const startX = pRect.right - 160
  let startY = pRect.top + 40
  for (let i = 0; i < 3; i++) {
    segments[i].x = segments[i].targetX = startX
    segments[i].y = segments[i].targetY = startY
    updateSegmentPos(i)
    startY += segments[i].dim.h + SEGMENT_SPACING
  }

  // Start blinking
  startBlinking(segments[0].el)

  // --- Touch drag (mobile-first) ---
  segments[0].el.addEventListener('touchstart', (e) => {
    e.preventDefault()
    const t = e.touches[0]
    dragState.active = true
    dragState.offsetX = t.clientX - segments[0].x
    dragState.offsetY = t.clientY - segments[0].y
    segments[0].el.classList.add('dragging')
  }, { passive: false })

  document.addEventListener('touchmove', (e) => {
    if (!dragState.active) return
    e.preventDefault()
    const t = e.touches[0]
    segments[0].targetX = t.clientX - dragState.offsetX
    segments[0].targetY = t.clientY - dragState.offsetY
    segments[0].x = segments[0].targetX
    segments[0].y = segments[0].targetY
    updateSegmentPos(0)
    scheduleRelayout()
  }, { passive: false })

  document.addEventListener('touchend', () => {
    if (!dragState.active) return
    dragState.active = false
    segments[0].el.classList.remove('dragging')
  })

  // --- Mouse drag ---
  segments[0].el.addEventListener('mousedown', (e) => {
    e.preventDefault()
    dragState.active = true
    dragState.offsetX = e.clientX - segments[0].x
    dragState.offsetY = e.clientY - segments[0].y
    segments[0].el.classList.add('dragging')
  })

  document.addEventListener('mousemove', (e) => {
    if (!dragState.active) return
    segments[0].targetX = e.clientX - dragState.offsetX
    segments[0].targetY = e.clientY - dragState.offsetY
    segments[0].x = segments[0].targetX
    segments[0].y = segments[0].targetY
    updateSegmentPos(0)
    scheduleRelayout()
  })

  document.addEventListener('mouseup', () => {
    if (!dragState.active) return
    dragState.active = false
    segments[0].el.classList.remove('dragging')
  })

  // Relayout on scroll
  scrollContainer.addEventListener('scroll', () => scheduleRelayout(), { passive: true })

  // Start physics loop for segment following
  requestAnimationFrame(physicsLoop)
}

function updateSegmentPos(i) {
  segments[i].el.style.transform = `translate(${segments[i].x}px, ${segments[i].y}px)`
}

// --- Physics: body & tail follow head with springy delay ---

function physicsLoop() {
  let moved = false

  for (let i = 1; i < 3; i++) {
    const leader = segments[i - 1]
    const seg = segments[i]

    // Target: below the leader, centered horizontally with slight offset
    const targetX = leader.x + (leader.dim.w - seg.dim.w) / 2
    const targetY = leader.y + leader.dim.h + SEGMENT_SPACING

    seg.targetX = targetX
    seg.targetY = targetY

    // Smooth follow (ease toward target)
    const dx = seg.targetX - seg.x
    const dy = seg.targetY - seg.y

    if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
      // Each segment is progressively slower → serpentine feel
      const speed = FOLLOW_SPEED / (i * 0.7 + 0.3)
      seg.x += dx * speed
      seg.y += dy * speed
      updateSegmentPos(i)
      moved = true
    }
  }

  if (moved) scheduleRelayout()

  requestAnimationFrame(physicsLoop)
}

// =============================================
// Init
// =============================================

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
        // Keep dragon in bounds
        const pRect = document.getElementById('parchment').getBoundingClientRect()
        if (segments[0].x > pRect.right - 50) segments[0].x = pRect.right - segments[0].dim.w - 20
        if (segments[0].x < pRect.left - 50) segments[0].x = pRect.left + 20
        updateSegmentPos(0)
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
