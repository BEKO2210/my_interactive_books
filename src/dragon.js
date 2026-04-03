// Black silhouette serpentine dragon — 3 segments that weave through text
// Inspired by medieval manuscript marginalia, circular coiling style

// Each segment is an independent obstacle for text displacement
// Head → Body → Tail, connected visually by a curved spine

export const SEGMENT_SIZE = 100 // each segment's bounding box
export const SEGMENT_COUNT = 3

// The dragon is built from 3 SVG segments that follow each other
// with physics-based delay, creating a serpentine weaving effect

export function createHeadSVG() {
  const svg = _svg(120, 120, '0 0 200 200')
  svg.innerHTML = `
    <defs>
      <clipPath id="head-clip"><circle cx="100" cy="100" r="98"/></clipPath>
    </defs>
    <g clip-path="url(#head-clip)">
      <!-- Head mass -->
      <path d="M 100 20 Q 155 20 170 55 Q 185 85 175 110 Q 168 130 150 145
               Q 130 158 100 160 Q 70 158 50 145 Q 32 130 25 110
               Q 15 85 30 55 Q 45 20 100 20 Z"
            fill="#1a1008" stroke="none"/>

      <!-- Snout -->
      <path d="M 55 105 Q 40 95 28 100 Q 18 105 15 115 Q 12 125 20 130
               Q 28 135 40 130 Q 50 125 55 115 Z"
            fill="#1a1008"/>
      <path d="M 145 105 Q 160 95 172 100 Q 182 105 185 115 Q 188 125 180 130
               Q 172 135 160 130 Q 150 125 145 115 Z"
            fill="#1a1008"/>

      <!-- Jaw / lower mouth -->
      <path d="M 65 130 Q 80 150 100 155 Q 120 150 135 130 Q 120 140 100 142 Q 80 140 65 130 Z"
            fill="#0f0a04"/>

      <!-- Teeth -->
      <path d="M 58 122 L 54 132 L 62 126 Z" fill="#d4c4a0"/>
      <path d="M 68 128 L 66 138 L 72 131 Z" fill="#d4c4a0"/>
      <path d="M 142 122 L 146 132 L 138 126 Z" fill="#d4c4a0"/>
      <path d="M 132 128 L 134 138 L 128 131 Z" fill="#d4c4a0"/>

      <!-- Nostril smoke -->
      <path d="M 30 108 Q 22 98 25 88 Q 28 80 23 70" fill="none" stroke="#2a2018" stroke-width="2.5" opacity="0.3" stroke-linecap="round"/>
      <path d="M 170 108 Q 178 98 175 88 Q 172 80 177 70" fill="none" stroke="#2a2018" stroke-width="2.5" opacity="0.3" stroke-linecap="round"/>

      <!-- Horns -->
      <path d="M 65 45 Q 50 20 38 5 Q 48 18 55 35 Q 58 42 62 48" fill="#1a1008"/>
      <path d="M 135 45 Q 150 20 162 5 Q 152 18 145 35 Q 142 42 138 48" fill="#1a1008"/>

      <!-- Spines on top -->
      <path d="M 82 25 L 78 8 L 88 22 Z" fill="#1a1008"/>
      <path d="M 100 22 L 100 3 L 105 20 Z" fill="#1a1008"/>
      <path d="M 118 25 L 122 8 L 112 22 Z" fill="#1a1008"/>

      <!-- Eye sockets -->
      <ellipse cx="75" cy="78" rx="14" ry="15" fill="#c4943a"/>
      <ellipse cx="125" cy="78" rx="14" ry="15" fill="#c4943a"/>

      <!-- Pupils (slit) -->
      <ellipse cx="75" cy="78" rx="4" ry="12" fill="#1a1008"/>
      <ellipse cx="125" cy="78" rx="4" ry="12" fill="#1a1008"/>

      <!-- Eye shine -->
      <circle cx="80" cy="73" r="3" fill="#fff" opacity="0.5"/>
      <circle cx="130" cy="73" r="3" fill="#fff" opacity="0.5"/>

      <!-- Blink eyelids (animated) -->
      <ellipse class="dragon-eyelid-l" cx="75" cy="78" rx="15" ry="0" fill="#1a1008">
        <animate attributeName="ry" values="0;16;0" dur="0.15s" begin="blink.begin" fill="freeze"/>
      </ellipse>
      <ellipse class="dragon-eyelid-r" cx="125" cy="78" rx="15" ry="0" fill="#1a1008">
        <animate attributeName="ry" values="0;16;0" dur="0.15s" begin="blink.begin" fill="freeze"/>
      </ellipse>

      <!-- Blink trigger: random interval via JS, but here a base animation -->
      <rect id="blink-trigger" width="0" height="0" opacity="0">
        <animate id="blink" attributeName="x" from="0" to="0" dur="0.01s"
                 begin="0s;blink.end+3.2s" fill="freeze"/>
      </rect>

      <!-- Ear frills -->
      <path d="M 48 60 Q 30 50 25 55 Q 30 65 45 65 Z" fill="#1a1008"/>
      <path d="M 152 60 Q 170 50 175 55 Q 170 65 155 65 Z" fill="#1a1008"/>
    </g>
  `
  return svg
}

export function createBodySVG() {
  const svg = _svg(110, 90, '0 0 220 180')
  svg.innerHTML = `
    <!-- Main body coil -->
    <path d="M 10 90 Q 10 30 55 15 Q 100 0 140 15 Q 185 35 210 90
             Q 215 120 185 150 Q 150 175 110 170
             Q 70 165 40 145 Q 10 125 10 90 Z"
          fill="#1a1008"/>

    <!-- Wing (left) -->
    <path d="M 50 70 Q 20 30 5 10 Q 15 25 10 40 Q 5 20 0 5
             Q 8 22 5 45 Q 3 28 0 18 Q 6 35 10 55 Q 15 50 25 60 L 50 70 Z"
          fill="#1a1008"/>
    <!-- Wing spines -->
    <path d="M 50 70 Q 25 40 8 12" fill="none" stroke="#2a1a08" stroke-width="1.5" opacity="0.3"/>
    <path d="M 45 65 Q 18 35 3 8" fill="none" stroke="#2a1a08" stroke-width="1" opacity="0.25"/>

    <!-- Wing (right) -->
    <path d="M 170 70 Q 200 30 215 10 Q 205 25 210 40 Q 215 20 220 5
             Q 212 22 215 45 Q 217 28 220 18 Q 214 35 210 55 Q 205 50 195 60 L 170 70 Z"
          fill="#1a1008"/>
    <path d="M 170 70 Q 195 40 212 12" fill="none" stroke="#2a1a08" stroke-width="1.5" opacity="0.3"/>
    <path d="M 175 65 Q 202 35 217 8" fill="none" stroke="#2a1a08" stroke-width="1" opacity="0.25"/>

    <!-- Belly detail -->
    <path d="M 80 85 Q 110 75 140 85" fill="none" stroke="#2a2018" stroke-width="2" opacity="0.2"/>
    <path d="M 75 100 Q 110 90 145 100" fill="none" stroke="#2a2018" stroke-width="2" opacity="0.2"/>
    <path d="M 78 115 Q 110 105 142 115" fill="none" stroke="#2a2018" stroke-width="2" opacity="0.2"/>

    <!-- Legs -->
    <path d="M 55 140 Q 45 160 40 172 Q 38 178 44 180 L 56 178 Q 50 172 52 164 Q 55 155 60 145"
          fill="#1a1008"/>
    <path d="M 44 180 L 38 184" stroke="#1a1008" stroke-width="3" stroke-linecap="round"/>
    <path d="M 50 179 L 47 184" stroke="#1a1008" stroke-width="3" stroke-linecap="round"/>

    <path d="M 165 140 Q 175 160 180 172 Q 182 178 176 180 L 164 178 Q 170 172 168 164 Q 165 155 160 145"
          fill="#1a1008"/>
    <path d="M 176 180 L 182 184" stroke="#1a1008" stroke-width="3" stroke-linecap="round"/>
    <path d="M 170 179 L 173 184" stroke="#1a1008" stroke-width="3" stroke-linecap="round"/>

    <!-- Scale dots -->
    <circle cx="90" cy="60" r="2" fill="#0f0a04" opacity="0.3"/>
    <circle cx="110" cy="55" r="2" fill="#0f0a04" opacity="0.3"/>
    <circle cx="130" cy="60" r="2" fill="#0f0a04" opacity="0.3"/>
    <circle cx="100" cy="130" r="2.5" fill="#0f0a04" opacity="0.2"/>
    <circle cx="120" cy="128" r="2.5" fill="#0f0a04" opacity="0.2"/>
  `
  return svg
}

export function createTailSVG() {
  const svg = _svg(130, 60, '0 0 260 120')
  svg.innerHTML = `
    <!-- Tail body — long coiling shape -->
    <path d="M 10 60 Q 30 25 65 20 Q 100 15 130 30
             Q 160 45 185 40 Q 210 35 235 20 Q 248 12 255 5
             L 260 15 Q 250 25 235 35 Q 210 50 185 55
             Q 160 60 130 50 Q 100 40 70 45
             Q 40 50 20 70 Q 12 78 10 60 Z"
          fill="#1a1008"/>

    <!-- Tail spines -->
    <path d="M 60 22 L 55 8 L 65 18 Z" fill="#1a1008"/>
    <path d="M 90 18 L 88 4 L 95 15 Z" fill="#1a1008"/>
    <path d="M 120 25 L 120 10 L 126 22 Z" fill="#1a1008"/>
    <path d="M 150 38 L 152 24 L 156 35 Z" fill="#1a1008"/>
    <path d="M 180 38 L 184 24 L 186 36 Z" fill="#1a1008"/>
    <path d="M 210 30 L 215 18 L 216 28 Z" fill="#1a1008"/>
    <path d="M 235 22 L 240 10 L 240 20 Z" fill="#1a1008"/>

    <!-- Tail tip — arrow/spade shape -->
    <path d="M 250 10 Q 260 0 265 10 Q 270 20 260 18 L 255 12 Z" fill="#1a1008"/>
    <path d="M 252 12 Q 255 2 262 8" fill="none" stroke="#0f0a04" stroke-width="1" opacity="0.3"/>

    <!-- Belly line -->
    <path d="M 25 62 Q 60 48 100 42 Q 140 48 170 52" fill="none" stroke="#2a2018" stroke-width="1.5" opacity="0.15"/>

    <!-- Scale hints -->
    <circle cx="50" cy="40" r="1.5" fill="#0f0a04" opacity="0.2"/>
    <circle cx="80" cy="32" r="1.5" fill="#0f0a04" opacity="0.2"/>
    <circle cx="110" cy="35" r="1.5" fill="#0f0a04" opacity="0.2"/>
    <circle cx="145" cy="45" r="1.5" fill="#0f0a04" opacity="0.2"/>
    <circle cx="175" cy="48" r="1.5" fill="#0f0a04" opacity="0.2"/>
    <circle cx="200" cy="40" r="1.5" fill="#0f0a04" opacity="0.15"/>
  `
  return svg
}

function _svg(w, h, viewBox) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', viewBox)
  svg.setAttribute('width', String(w))
  svg.setAttribute('height', String(h))
  svg.setAttribute('fill', 'none')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  return svg
}

// --- Blink controller ---
// Randomized blinking: the dragon blinks at irregular intervals like a real animal

export function startBlinking(headEl) {
  const eyelids = headEl.querySelectorAll('.dragon-eyelid-l, .dragon-eyelid-r')
  if (!eyelids.length) return

  function blink() {
    eyelids.forEach(lid => {
      // Reset and replay animation
      const anim = lid.querySelector('animate')
      if (anim) {
        anim.beginElement()
      } else {
        // Fallback: CSS-based blink
        lid.setAttribute('ry', '16')
        setTimeout(() => lid.setAttribute('ry', '0'), 150)
      }
    })

    // Double-blink 30% of the time
    if (Math.random() < 0.3) {
      setTimeout(() => {
        eyelids.forEach(lid => {
          const anim = lid.querySelector('animate')
          if (anim) anim.beginElement()
          else {
            lid.setAttribute('ry', '16')
            setTimeout(() => lid.setAttribute('ry', '0'), 120)
          }
        })
      }, 250)
    }

    // Next blink: 2–6 seconds, like a real animal
    const next = 2000 + Math.random() * 4000
    setTimeout(blink, next)
  }

  // First blink after 1–3 seconds
  setTimeout(blink, 1000 + Math.random() * 2000)
}

// Segment dimensions for text displacement calculations
export const SEGMENT_DIMS = [
  { w: 120, h: 120 }, // head
  { w: 110, h: 90 },  // body
  { w: 130, h: 60 },  // tail
]
