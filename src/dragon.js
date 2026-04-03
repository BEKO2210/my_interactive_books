// Medieval manuscript illumination dragon — SVG
// Flat, ornate, painted style like 13th-15th century marginalia

export const DRAGON_WIDTH = 140
export const DRAGON_HEIGHT = 150

export function createDragonSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 280 300')
  svg.setAttribute('width', DRAGON_WIDTH)
  svg.setAttribute('height', DRAGON_HEIGHT)
  svg.setAttribute('fill', 'none')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  svg.innerHTML = `
    <defs>
      <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#8b1a1a"/>
        <stop offset="50%" stop-color="#6b1510"/>
        <stop offset="100%" stop-color="#4a0e0a"/>
      </linearGradient>
      <linearGradient id="wingGrad" x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stop-color="#c4943a"/>
        <stop offset="40%" stop-color="#a87830"/>
        <stop offset="100%" stop-color="#785520"/>
      </linearGradient>
      <linearGradient id="wingGrad2" x1="1" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stop-color="#c4943a"/>
        <stop offset="40%" stop-color="#a87830"/>
        <stop offset="100%" stop-color="#785520"/>
      </linearGradient>
      <radialGradient id="eyeGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="#ffdd44"/>
        <stop offset="60%" stop-color="#cc8800"/>
        <stop offset="100%" stop-color="#884400"/>
      </radialGradient>
      <linearGradient id="bellyGrad" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#d4a040"/>
        <stop offset="100%" stop-color="#b08030"/>
      </linearGradient>
    </defs>

    <!-- Left Wing (behind body) -->
    <g opacity="0.9">
      <path d="M 90 120 Q 20 60 30 20 Q 45 50 60 55 Q 30 30 40 8 Q 55 40 70 50 Q 50 15 65 2 Q 72 38 82 55 L 100 100 Z"
            fill="url(#wingGrad)" stroke="#5a3a10" stroke-width="1.5"/>
      <!-- Wing membrane lines -->
      <path d="M 90 115 Q 50 70 38 18" fill="none" stroke="#6a4a18" stroke-width="0.8" opacity="0.5"/>
      <path d="M 92 110 Q 55 65 52 12" fill="none" stroke="#6a4a18" stroke-width="0.8" opacity="0.5"/>
      <path d="M 95 105 Q 65 55 68 5" fill="none" stroke="#6a4a18" stroke-width="0.8" opacity="0.5"/>
    </g>

    <!-- Right Wing (behind body) -->
    <g opacity="0.9">
      <path d="M 190 120 Q 260 60 250 20 Q 235 50 220 55 Q 250 30 240 8 Q 225 40 210 50 Q 230 15 215 2 Q 208 38 198 55 L 180 100 Z"
            fill="url(#wingGrad2)" stroke="#5a3a10" stroke-width="1.5"/>
      <!-- Wing membrane lines -->
      <path d="M 190 115 Q 230 70 242 18" fill="none" stroke="#6a4a18" stroke-width="0.8" opacity="0.5"/>
      <path d="M 188 110 Q 225 65 228 12" fill="none" stroke="#6a4a18" stroke-width="0.8" opacity="0.5"/>
      <path d="M 185 105 Q 215 55 212 5" fill="none" stroke="#6a4a18" stroke-width="0.8" opacity="0.5"/>
    </g>

    <!-- Tail -->
    <path d="M 130 230 Q 100 260 80 270 Q 60 280 40 275 Q 55 268 45 258 Q 35 248 25 252 L 20 245 Q 35 240 42 250 Q 50 245 60 265 Q 80 258 100 242 Q 118 228 128 225"
          fill="url(#bodyGrad)" stroke="#3a0a06" stroke-width="1.5"/>
    <!-- Tail spines -->
    <path d="M 80 265 L 75 255 L 85 262" fill="#4a1510" stroke="#3a0a06" stroke-width="0.5"/>
    <path d="M 60 272 L 52 263 L 64 269" fill="#4a1510" stroke="#3a0a06" stroke-width="0.5"/>
    <path d="M 42 270 L 33 262 L 45 267" fill="#4a1510" stroke="#3a0a06" stroke-width="0.5"/>
    <!-- Tail tip (arrow) -->
    <path d="M 20 245 L 8 240 L 18 235 L 25 244" fill="#6b1510" stroke="#3a0a06" stroke-width="1"/>

    <!-- Body -->
    <ellipse cx="140" cy="185" rx="52" ry="55" fill="url(#bodyGrad)" stroke="#3a0a06" stroke-width="2"/>

    <!-- Belly scales -->
    <path d="M 122 165 Q 140 158 158 165" fill="none" stroke="url(#bellyGrad)" stroke-width="2" opacity="0.7"/>
    <path d="M 118 178 Q 140 170 162 178" fill="none" stroke="url(#bellyGrad)" stroke-width="2" opacity="0.7"/>
    <path d="M 116 191 Q 140 183 164 191" fill="none" stroke="url(#bellyGrad)" stroke-width="2" opacity="0.7"/>
    <path d="M 118 204 Q 140 196 162 204" fill="none" stroke="url(#bellyGrad)" stroke-width="2" opacity="0.6"/>
    <path d="M 122 216 Q 140 208 158 216" fill="none" stroke="url(#bellyGrad)" stroke-width="2" opacity="0.5"/>

    <!-- Back spines -->
    <path d="M 135 132 L 128 118 L 140 128" fill="#6b1a1a" stroke="#3a0a06" stroke-width="0.8"/>
    <path d="M 142 130 L 138 114 L 148 127" fill="#6b1a1a" stroke="#3a0a06" stroke-width="0.8"/>
    <path d="M 150 133 L 149 117 L 157 130" fill="#6b1a1a" stroke="#3a0a06" stroke-width="0.8"/>

    <!-- Left Hind Leg -->
    <path d="M 108 220 Q 95 245 85 260 Q 80 268 88 270 L 100 268 Q 95 262 100 252 Q 105 240 112 225"
          fill="url(#bodyGrad)" stroke="#3a0a06" stroke-width="1.5"/>
    <!-- Claws -->
    <path d="M 88 270 L 83 274" stroke="#3a0a06" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 93 270 L 90 275" stroke="#3a0a06" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 98 269 L 97 274" stroke="#3a0a06" stroke-width="1.5" stroke-linecap="round"/>

    <!-- Right Hind Leg -->
    <path d="M 172 220 Q 185 245 195 260 Q 200 268 192 270 L 180 268 Q 185 262 180 252 Q 175 240 168 225"
          fill="url(#bodyGrad)" stroke="#3a0a06" stroke-width="1.5"/>
    <!-- Claws -->
    <path d="M 192 270 L 197 274" stroke="#3a0a06" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 187 270 L 190 275" stroke="#3a0a06" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 182 269 L 183 274" stroke="#3a0a06" stroke-width="1.5" stroke-linecap="round"/>

    <!-- Left Front Leg -->
    <path d="M 105 175 Q 88 195 82 210 Q 78 218 85 220 L 96 218 Q 90 212 94 204 Q 98 195 108 182"
          fill="url(#bodyGrad)" stroke="#3a0a06" stroke-width="1.5"/>
    <path d="M 85 220 L 80 224" stroke="#3a0a06" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 90 220 L 87 225" stroke="#3a0a06" stroke-width="1.5" stroke-linecap="round"/>

    <!-- Right Front Leg -->
    <path d="M 175 175 Q 192 195 198 210 Q 202 218 195 220 L 184 218 Q 190 212 186 204 Q 182 195 172 182"
          fill="url(#bodyGrad)" stroke="#3a0a06" stroke-width="1.5"/>
    <path d="M 195 220 L 200 224" stroke="#3a0a06" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 190 220 L 193 225" stroke="#3a0a06" stroke-width="1.5" stroke-linecap="round"/>

    <!-- Neck -->
    <path d="M 120 155 Q 115 130 120 110 Q 128 90 140 80 Q 152 90 160 110 Q 165 130 160 155"
          fill="url(#bodyGrad)" stroke="#3a0a06" stroke-width="2"/>
    <!-- Neck scales -->
    <path d="M 128 145 Q 140 140 152 145" fill="none" stroke="url(#bellyGrad)" stroke-width="1.5" opacity="0.6"/>
    <path d="M 130 135 Q 140 130 150 135" fill="none" stroke="url(#bellyGrad)" stroke-width="1.5" opacity="0.6"/>
    <path d="M 132 125 Q 140 120 148 125" fill="none" stroke="url(#bellyGrad)" stroke-width="1.5" opacity="0.5"/>

    <!-- Head -->
    <path d="M 115 95 Q 110 75 115 60 Q 125 45 140 42 Q 155 45 165 60 Q 170 75 165 95 Q 155 105 140 108 Q 125 105 115 95 Z"
          fill="url(#bodyGrad)" stroke="#3a0a06" stroke-width="2"/>

    <!-- Snout -->
    <path d="M 118 78 Q 110 68 105 62 Q 100 55 105 50 Q 112 48 118 55 Q 122 60 125 68 Z"
          fill="#7b1a15" stroke="#3a0a06" stroke-width="1.5"/>
    <path d="M 162 78 Q 170 68 175 62 Q 180 55 175 50 Q 168 48 162 55 Q 158 60 155 68 Z"
          fill="#7b1a15" stroke="#3a0a06" stroke-width="1.5"/>

    <!-- Nostrils -->
    <circle cx="110" cy="58" r="3" fill="#2a0505" opacity="0.7"/>
    <circle cx="170" cy="58" r="3" fill="#2a0505" opacity="0.7"/>

    <!-- Smoke wisps from nostrils -->
    <path d="M 108 55 Q 102 48 105 40 Q 108 35 104 28" fill="none" stroke="#8a7a6a" stroke-width="1.2" opacity="0.35"/>
    <path d="M 172 55 Q 178 48 175 40 Q 172 35 176 28" fill="none" stroke="#8a7a6a" stroke-width="1.2" opacity="0.35"/>

    <!-- Eyes -->
    <ellipse cx="128" cy="72" rx="7" ry="8" fill="url(#eyeGlow)" stroke="#3a0a06" stroke-width="1.5"/>
    <ellipse cx="152" cy="72" rx="7" ry="8" fill="url(#eyeGlow)" stroke="#3a0a06" stroke-width="1.5"/>
    <!-- Slit pupils -->
    <ellipse cx="128" cy="72" rx="2.5" ry="6" fill="#1a0a00"/>
    <ellipse cx="152" cy="72" rx="2.5" ry="6" fill="#1a0a00"/>
    <!-- Eye highlight -->
    <circle cx="131" cy="69" r="1.5" fill="#fff" opacity="0.6"/>
    <circle cx="155" cy="69" r="1.5" fill="#fff" opacity="0.6"/>

    <!-- Horns -->
    <path d="M 120 58 Q 112 40 108 25 Q 115 35 120 50" fill="#5a3a10" stroke="#3a2008" stroke-width="1.2"/>
    <path d="M 160 58 Q 168 40 172 25 Q 165 35 160 50" fill="#5a3a10" stroke="#3a2008" stroke-width="1.2"/>

    <!-- Ear frills -->
    <path d="M 114 68 Q 102 62 98 68 Q 104 72 114 72" fill="#9b2a20" stroke="#3a0a06" stroke-width="0.8"/>
    <path d="M 166 68 Q 178 62 182 68 Q 176 72 166 72" fill="#9b2a20" stroke="#3a0a06" stroke-width="0.8"/>

    <!-- Mouth line -->
    <path d="M 118 88 Q 128 94 140 95 Q 152 94 162 88" fill="none" stroke="#3a0a06" stroke-width="1.2"/>

    <!-- Teeth hints -->
    <path d="M 122 89 L 124 93 L 126 89" fill="#e8e0d0" stroke="#3a0a06" stroke-width="0.5"/>
    <path d="M 154 89 L 156 93 L 158 89" fill="#e8e0d0" stroke="#3a0a06" stroke-width="0.5"/>

    <!-- Decorative gold border/filigree around body — manuscript illumination style -->
    <circle cx="140" cy="155" r="3" fill="#c4943a" opacity="0.5"/>
    <circle cx="96" cy="190" r="2" fill="#c4943a" opacity="0.4"/>
    <circle cx="184" cy="190" r="2" fill="#c4943a" opacity="0.4"/>

    <!-- Scale texture dots on body -->
    <circle cx="125" cy="175" r="1.5" fill="#5a1210" opacity="0.4"/>
    <circle cx="135" cy="170" r="1.5" fill="#5a1210" opacity="0.4"/>
    <circle cx="145" cy="172" r="1.5" fill="#5a1210" opacity="0.4"/>
    <circle cx="155" cy="175" r="1.5" fill="#5a1210" opacity="0.4"/>
    <circle cx="130" cy="185" r="1.5" fill="#5a1210" opacity="0.3"/>
    <circle cx="150" cy="185" r="1.5" fill="#5a1210" opacity="0.3"/>
    <circle cx="120" cy="195" r="1.5" fill="#5a1210" opacity="0.3"/>
    <circle cx="160" cy="195" r="1.5" fill="#5a1210" opacity="0.3"/>
    <circle cx="140" cy="200" r="1.5" fill="#5a1210" opacity="0.25"/>
  `
  return svg
}
