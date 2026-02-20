import Phaser from 'phaser'

// ══════════════════════════════════════════════════
//  NEON ODYSSEY — A Greek Mythology Brick Breaker
//  Built for Z01 Athens Jam · Phaser 3
// ══════════════════════════════════════════════════

const W = 960
const H = 600
const PADDLE_Y = H - 44
const BRICK_W = 76
const BRICK_H = 24
const BRICK_GAP = 6
const BRICK_COLS = 11
const BRICK_START_Y = 100

// Color palette
const C = {
  bg: 0x0a0e27,
  gold: 0xfbbf24,
  goldBright: 0xfde68a,
  neonBlue: 0x38bdf8,
  neonCyan: 0x22d3ee,
  neonPurple: 0xa855f7,
  neonPink: 0xec4899,
  neonGreen: 0x4ade80,
  neonRed: 0xef4444,
  neonOrange: 0xf97316,
  white: 0xffffff,
  bronze: 0xcd7f32,
}

// Hi-score persistence
function getHiScore() {
  try { return parseInt(localStorage.getItem('neonOdyssey_hi') || '0', 10) } catch { return 0 }
}
function setHiScore(s) {
  try { localStorage.setItem('neonOdyssey_hi', String(s)) } catch {}
}

// ── TEMPLE DATA ──────────────────────────────────
const TEMPLES = [
  {
    name: 'Temple of Athena',
    sub: 'Athens',
    brickNormal: 0x3b82f6,
    brickStrong: 0x1d4ed8,
    brickMedusa: 0x7c3aed,
    accent: 0xfbbf24,
    bg: 0x0c1445,
    levels: [
      [
        '..1111111..',
        '.112222211.',
        '.123333321.',
        '.112222211.',
        '..1111111..',
      ],
      [
        '11111111111',
        '1..22.22..1',
        '1.3.2.2.3.1',
        '1..22.22..1',
        '11111111111',
      ],
      [
        '22222.22222',
        '22111.11122',
        '11133.33111',
        '22111.11122',
        '22222.22222',
      ],
    ],
  },
  {
    name: 'Fortress of Ares',
    sub: 'Sparta',
    brickNormal: 0xdc2626,
    brickStrong: 0x991b1b,
    brickMedusa: 0xf97316,
    accent: 0xcd7f32,
    bg: 0x1a0808,
    levels: [
      [
        '2.2.1.1.2.2',
        '.1.1.1.1.1.',
        '1.2.3.3.2.1',
        '.1.1.1.1.1.',
        '2.2.1.1.2.2',
      ],
      [
        '22222222222',
        '21111111112',
        '21.33333.12',
        '21111111112',
        '22222222222',
        '..2222222..',
      ],
      [
        '22223333222',
        '32222222223',
        '32111111123',
        '32111111123',
        '32222222223',
        '22223333222',
      ],
    ],
  },
  {
    name: 'Summit of Zeus',
    sub: 'Olympus',
    brickNormal: 0xeab308,
    brickStrong: 0xa16207,
    brickMedusa: 0xd946ef,
    accent: 0xc084fc,
    bg: 0x1a0f30,
    levels: [
      [
        '2.2.3.3.2.2',
        '.2.2.2.2.2.',
        '2.1.3.3.1.2',
        '.2.2.2.2.2.',
        '2.2.3.3.2.2',
      ],
      [
        '22222.22222',
        '32233.33223',
        '32231.13223',
        '32233.33223',
        '22222.22222',
        '..3333333..',
      ],
      [
        '33333333333',
        '33222222233',
        '32233333223',
        '32232.23223',
        '32233333223',
        '33222222233',
        '33333333333',
      ],
    ],
  },
]

const TEMPLE_LORE = [
  'Athena tests precision: every rebound is a choice.',
  'Ares demands aggression: dominate pressure without panic.',
  'Zeus rewards mastery: survive chaos and command the storm.',
]

const TEMPLE_PARALLAX = [
  {
    layers: [
      { key: 'athena_sky', path: '/backgrounds/athena/sky.svg', speed: 0.0038, alpha: 0.985, waveAmp: 0.8, waveSpeed: 0.00045 },
      { key: 'athena_mid', path: '/backgrounds/athena/mid.svg', speed: 0.0082, alpha: 0.955, waveAmp: 1.1, waveSpeed: 0.00055 },
      { key: 'athena_front', path: '/backgrounds/athena/front.svg', speed: 0.0135, alpha: 0.935, waveAmp: 1.6, waveSpeed: 0.00075 },
    ],
  },
  {
    layers: [
      { key: 'ares_sky', path: '/backgrounds/ares/sky.svg', speed: 0.0075, alpha: 0.92, waveAmp: 0.4, waveSpeed: 0.0003 },
      { key: 'ares_mid', path: '/backgrounds/ares/mid.svg', speed: 0.0165, alpha: 0.9, waveAmp: 0.8, waveSpeed: 0.00045 },
      { key: 'ares_front', path: '/backgrounds/ares/front.svg', speed: 0.028, alpha: 0.89, waveAmp: 1.2, waveSpeed: 0.0006 },
    ],
  },
  {
    layers: [
      { key: 'zeus_sky', path: '/backgrounds/zeus/sky.svg', speed: 0.0082, alpha: 0.95, waveAmp: 1.8, waveSpeed: 0.0012 },
      { key: 'zeus_mid', path: '/backgrounds/zeus/mid.svg', speed: 0.0195, alpha: 0.92, waveAmp: 2.8, waveSpeed: 0.0016 },
      { key: 'zeus_front', path: '/backgrounds/zeus/front.svg', speed: 0.033, alpha: 0.91, waveAmp: 3.8, waveSpeed: 0.0022 },
    ],
  },
]

const TEMPLE_MOOD = [
  {
    starCount: 24,
    starAlpha: [0.016, 0.085],
    moteCount: 9,
    moteDrift: 20,
    overlayAlpha: 0.28,
    glowColor: C.gold,
    sigilAlpha: 0.25,
  },
  {
    starCount: 12,
    starAlpha: [0.008, 0.048],
    moteCount: 22,
    moteDrift: 52,
    overlayAlpha: 0.49,
    glowColor: C.neonOrange,
    sigilAlpha: 0.16,
  },
  {
    starCount: 42,
    starAlpha: [0.03, 0.17],
    moteCount: 20,
    moteDrift: 40,
    overlayAlpha: 0.33,
    glowColor: C.neonCyan,
    sigilAlpha: 0.24,
  },
]

// ── UPGRADE POOL ─────────────────────────────────
const UPGRADE_POOL = [
  { name: 'Gift of Life', desc: '+1 Life', icon: '♥', key: 'lives', delta: 1 },
  { name: 'Broader Shield', desc: 'Wider paddle', icon: '⛨', key: 'paddleW', delta: 20 },
  { name: 'Calm Winds', desc: 'Slower ball', icon: '☁', key: 'ballSpd', delta: -15 },
  { name: 'Divine Favor', desc: 'More powerups', icon: '★', key: 'dropRate', delta: 8 },
  { name: "Hero's Focus", desc: '+50% combo bonus', icon: '⚡', key: 'comboBon', delta: 0.5 },
]

// ══════════ AUDIO ════════════════════════════════
let audioCtx = null
let bgmState = { key: null, nodes: [] }

function getAudioCtx() {
  if (audioCtx) {
    if (audioCtx.state === 'suspended') audioCtx.resume()
    return audioCtx
  }
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  audioCtx = new AC()
  return audioCtx
}

function stopBgm(fade = 0.25) {
  if (!audioCtx || bgmState.nodes.length === 0) return
  const now = audioCtx.currentTime
  bgmState.nodes.forEach((nodeSet) => {
    if (nodeSet.gain && nodeSet.gain.gain) {
      nodeSet.gain.gain.cancelScheduledValues(now)
      nodeSet.gain.gain.setValueAtTime(Math.max(0.0001, nodeSet.gain.gain.value), now)
      nodeSet.gain.gain.exponentialRampToValueAtTime(0.0001, now + fade)
    }
    if (nodeSet.osc) {
      try { nodeSet.osc.stop(now + fade + 0.05) } catch {}
    }
  })
  bgmState = { key: null, nodes: [] }
}

function bgmPreset(key) {
  const presets = {
    menu: {
      tempo: 6.8,
      vol: 0.028,
      tones: [196, 293.66, 392],
      wave: ['triangle', 'sine', 'sine'],
      filter: 1700,
    },
    'temple-0': {
      tempo: 5.6,
      vol: 0.03,
      tones: [220, 329.63, 493.88],
      wave: ['triangle', 'sine', 'triangle'],
      filter: 1900,
    },
    'temple-1': {
      tempo: 5.0,
      vol: 0.031,
      tones: [174.61, 261.63, 392],
      wave: ['sawtooth', 'triangle', 'sine'],
      filter: 1450,
    },
    'temple-2': {
      tempo: 4.8,
      vol: 0.032,
      tones: [246.94, 369.99, 523.25],
      wave: ['triangle', 'sine', 'square'],
      filter: 2100,
    },
    upgrade: {
      tempo: 7.8,
      vol: 0.026,
      tones: [261.63, 392, 587.33],
      wave: ['sine', 'triangle', 'sine'],
      filter: 2200,
    },
    victory: {
      tempo: 8.2,
      vol: 0.028,
      tones: [329.63, 493.88, 659.25],
      wave: ['triangle', 'sine', 'sine'],
      filter: 2400,
    },
  }
  return presets[key] || presets.menu
}

function playBgm(key) {
  const ctx = getAudioCtx()
  if (!ctx) return
  if (bgmState.key === key && bgmState.nodes.length > 0) return

  stopBgm(0.2)
  const preset = bgmPreset(key)
  const now = ctx.currentTime

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(preset.filter, now)

  const master = ctx.createGain()
  master.gain.setValueAtTime(0.0001, now)
  master.gain.exponentialRampToValueAtTime(preset.vol, now + 0.35)
  filter.connect(master)
  master.connect(ctx.destination)

  const nodes = []
  preset.tones.forEach((tone, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()

    osc.type = preset.wave[i] || 'sine'
    osc.frequency.setValueAtTime(tone, now)

    gain.gain.setValueAtTime(0.0001, now)
    const targetGain = preset.vol * (i === 0 ? 0.62 : i === 1 ? 0.46 : 0.28)
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, targetGain), now + 0.42)

    lfo.type = 'sine'
    lfo.frequency.setValueAtTime(1 / (preset.tempo + i * 0.7), now)
    lfoGain.gain.setValueAtTime(tone * (0.008 + i * 0.002), now)

    lfo.connect(lfoGain)
    lfoGain.connect(osc.frequency)

    osc.connect(gain)
    gain.connect(filter)

    osc.start(now)
    lfo.start(now)

    nodes.push({ osc, gain })
    nodes.push({ osc: lfo, gain: lfoGain })
  })

  const pulse = ctx.createOscillator()
  const pulseGain = ctx.createGain()
  pulse.type = 'sine'
  pulse.frequency.setValueAtTime(1 / preset.tempo, now)
  pulseGain.gain.setValueAtTime(0.006, now)
  pulse.connect(pulseGain)
  pulseGain.connect(master.gain)
  pulse.start(now)
  nodes.push({ osc: pulse, gain: pulseGain })

  bgmState = { key, nodes }
}

function sfx(freq = 440, freqEnd = null, dur = 0.08, vol = 0.055, type = 'sine') {
  const ctx = getAudioCtx()
  if (!ctx) return
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, now)
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), now + dur)
  gain.gain.setValueAtTime(0.001, now)
  gain.gain.exponentialRampToValueAtTime(vol, now + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + dur + 0.02)
}

function drawTempleSigil(scene, x, y, templeIdx, color, depth = 1, alpha = 0.22, scale = 1) {
  const g = scene.add.graphics().setDepth(depth).setAlpha(alpha)
  const s = scale

  g.lineStyle(2, color, 0.46)
  g.strokeCircle(x, y, 92 * s)
  g.lineStyle(1, C.neonCyan, 0.26)
  g.strokeCircle(x, y, 68 * s)

  if (templeIdx === 0) {
    g.lineStyle(2, color, 0.42)
    g.lineBetween(x - 34 * s, y - 8 * s, x + 34 * s, y - 8 * s)
    g.strokeCircle(x - 22 * s, y - 2 * s, 7 * s)
    g.strokeCircle(x + 22 * s, y - 2 * s, 7 * s)
    g.lineBetween(x - 18 * s, y + 18 * s, x, y + 30 * s)
    g.lineBetween(x + 18 * s, y + 18 * s, x, y + 30 * s)
    g.lineBetween(x - 46 * s, y - 44 * s, x - 18 * s, y - 64 * s)
    g.lineBetween(x + 46 * s, y - 44 * s, x + 18 * s, y - 64 * s)
  } else if (templeIdx === 1) {
    g.lineStyle(3, color, 0.4)
    g.lineBetween(x - 58 * s, y + 58 * s, x + 58 * s, y - 58 * s)
    g.lineBetween(x - 58 * s, y - 58 * s, x + 58 * s, y + 58 * s)
    g.fillStyle(color, 0.3)
    g.fillTriangle(x - 62 * s, y - 62 * s, x - 44 * s, y - 58 * s, x - 58 * s, y - 44 * s)
    g.fillTriangle(x + 62 * s, y + 62 * s, x + 44 * s, y + 58 * s, x + 58 * s, y + 44 * s)
    g.fillTriangle(x + 62 * s, y - 62 * s, x + 44 * s, y - 58 * s, x + 58 * s, y - 44 * s)
    g.fillTriangle(x - 62 * s, y + 62 * s, x - 44 * s, y + 58 * s, x - 58 * s, y + 44 * s)
  } else {
    g.lineStyle(3, color, 0.42)
    g.lineBetween(x - 15 * s, y - 56 * s, x + 6 * s, y - 20 * s)
    g.lineBetween(x + 6 * s, y - 20 * s, x - 7 * s, y - 20 * s)
    g.lineBetween(x - 7 * s, y - 20 * s, x + 12 * s, y + 16 * s)
    g.lineBetween(x + 12 * s, y + 16 * s, x - 3 * s, y + 16 * s)
    g.lineBetween(x - 3 * s, y + 16 * s, x + 14 * s, y + 56 * s)
    g.lineStyle(1, C.neonCyan, 0.24)
    g.strokeCircle(x, y, 44 * s)
    g.strokeCircle(x, y, 26 * s)
  }
  return g
}

function preloadTempleParallax(scene) {
  TEMPLE_PARALLAX.forEach((temple) => {
    temple.layers.forEach((layer) => {
      if (!scene.textures.exists(layer.key)) {
        scene.load.image(layer.key, layer.path)
      }
    })
  })
}

function createTempleParallax(scene, { templeIdx = 0, depth = -6 } = {}) {
  if (scene.templeParallaxLayers?.length) {
    scene.templeParallaxLayers.forEach((layer) => layer.destroy())
  }
  scene.templeParallaxLayers = []

  const temple = TEMPLE_PARALLAX[templeIdx]
  if (!temple) return false

  const available = temple.layers.every((layer) => scene.textures.exists(layer.key))
  if (!available) return false

  temple.layers.forEach((layer, i) => {
    const sprite = scene.add
      .tileSprite(W / 2, H / 2, W, H, layer.key)
      .setDepth(depth + i)
      .setAlpha(layer.alpha ?? 1)
      .setScrollFactor(0)
    sprite.setData('parallaxSpeed', layer.speed)
    sprite.setData('baseY', sprite.y)
    sprite.setData('waveAmp', layer.waveAmp || 0)
    sprite.setData('waveSpeed', layer.waveSpeed || 0)
    sprite.setData('wavePhase', Math.random() * Math.PI * 2)
    scene.templeParallaxLayers.push(sprite)
  })

  return true
}

function advanceTempleParallax(scene, delta = 0) {
  if (!scene.templeParallaxLayers?.length) return
  const now = scene.time?.now || 0
  scene.templeParallaxLayers.forEach((layer) => {
    const speed = layer.getData('parallaxSpeed') || 0
    layer.tilePositionX += speed * delta
    const amp = layer.getData('waveAmp') || 0
    const waveSpeed = layer.getData('waveSpeed') || 0
    if (amp > 0 && waveSpeed > 0) {
      const phase = layer.getData('wavePhase') || 0
      const baseY = layer.getData('baseY') || layer.y
      layer.y = baseY + Math.sin(now * waveSpeed + phase) * amp
    }
  })
}

function createTempleAtmosphere(scene, {
  templeIdx = 0,
  accent = C.neonCyan,
  bgColor = C.bg,
  depth = -3,
  sigilY = 122,
  sigilScale = 1,
  columns = false,
  vignette = true,
} = {}) {
  const mood = TEMPLE_MOOD[templeIdx] || TEMPLE_MOOD[0]
  const hasParallax = createTempleParallax(scene, { templeIdx, depth: depth - 1 })
  scene.add.rectangle(W / 2, H / 2, W, H, bgColor, hasParallax ? mood.overlayAlpha : 1).setDepth(depth)
  scene.add.rectangle(W / 2, H * 0.28, W * 1.1, H * 0.68, accent, templeIdx === 1 ? 0.045 : 0.03)
    .setDepth(depth + 1)
    .setBlendMode(Phaser.BlendModes.SCREEN)
  scene.add.circle(W * 0.24, H * 0.2, 96, accent, templeIdx === 2 ? 0.04 : 0.03).setDepth(depth + 1)
  scene.add.circle(W * 0.79, H * 0.22, 78, C.neonCyan, 0.026).setDepth(depth + 1)
  scene.add.circle(W * 0.55, H * 0.34, 88, C.neonPurple, 0.022).setDepth(depth + 1)

  const fog = scene.add.graphics().setDepth(depth + 1)
  fog.fillStyle(0xffffff, 0.012)
  fog.fillRoundedRect(-40, H * 0.56, W + 80, 88, 48)
  fog.fillStyle(0x020617, 0.06)
  fog.fillRoundedRect(-40, H * 0.76, W + 80, 78, 42)
  fog.fillStyle(accent, 0.016)
  fog.fillRoundedRect(-40, H * 0.61, W + 80, 56, 36)

  for (let i = 0; i < mood.starCount; i++) {
    const star = scene.add.circle(
      Phaser.Math.Between(24, W - 24),
      Phaser.Math.Between(12, H - 12),
      Phaser.Math.FloatBetween(0.45, 1.45),
      C.white,
      Phaser.Math.FloatBetween(mood.starAlpha[0], mood.starAlpha[1])
    ).setDepth(depth + 2)
    scene.tweens.add({
      targets: star,
      alpha: { from: star.alpha, to: Phaser.Math.FloatBetween(0.01, 0.06) },
      duration: Phaser.Math.Between(2600, 6200),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  for (let i = 0; i < mood.moteCount; i++) {
    const mote = scene.add.circle(
      Phaser.Math.Between(50, W - 50),
      Phaser.Math.Between(70, H - 60),
      Phaser.Math.FloatBetween(1.2, 2.8),
      Phaser.Math.Between(0, 1) ? mood.glowColor : accent,
      Phaser.Math.FloatBetween(0.06, 0.17)
    ).setDepth(depth + 2)
    scene.tweens.add({
      targets: mote,
      y: mote.y + Phaser.Math.Between(-mood.moteDrift, mood.moteDrift),
      x: mote.x + Phaser.Math.Between(-(mood.moteDrift + 8), mood.moteDrift + 8),
      alpha: { from: mote.alpha, to: Phaser.Math.FloatBetween(0.015, 0.11) },
      duration: Phaser.Math.Between(3400, 7600),
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  const skyline = scene.add.graphics().setDepth(depth + 2)
  skyline.fillStyle(0x020617, 0.2)
  skyline.fillRect(0, H - 74, W, 74)
  skyline.fillStyle(0x020617, 0.1)
  skyline.fillRect(0, H - 112, W, 42)
  skyline.fillStyle(accent, 0.045)
  skyline.fillTriangle(110, H - 74, 170, H - 122, 230, H - 74)
  skyline.fillTriangle(620, H - 74, 700, H - 132, 780, H - 74)
  skyline.fillRect(370, H - 96, 220, 20)
  skyline.fillStyle(C.neonCyan, 0.05)
  skyline.fillRect(0, H - 114, W, 1)

  if (columns) {
    const col = scene.add.graphics().setDepth(depth + 2)
    ;[52, W - 52].forEach((x) => {
      col.fillStyle(accent, 0.026)
      col.fillRect(x - 12, 26, 24, H - 52)
      col.fillStyle(accent, 0.05)
      col.fillRect(x - 18, 26, 36, 10)
      col.fillRect(x - 18, H - 36, 36, 10)
    })
  }

  const sigil = drawTempleSigil(scene, W / 2, sigilY, templeIdx, accent, depth + 3, mood.sigilAlpha, sigilScale)
  scene.tweens.add({
    targets: sigil,
    angle: templeIdx === 1 ? -4 : 4,
    duration: 7600,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  })

  if (vignette) {
    const vg = scene.add.graphics().setDepth(depth + 4)
    vg.fillStyle(0x000000, 0.075)
    vg.fillRect(0, 0, W, 16)
    vg.fillRect(0, H - 18, W, 18)
    vg.fillRect(0, 0, 12, H)
    vg.fillRect(W - 12, 0, 12, H)
  }
}

function addEndScreenBackdrop(scene, { templeIdx = 0, accent = C.neonCyan, mood = 'victory', depth = 39 } = {}) {
  const tone = mood === 'victory' ? accent : 0x7f1d1d
  const base = scene.add.rectangle(W / 2, H / 2, W, H, tone, 0).setDepth(depth)
  scene.tweens.add({
    targets: base,
    fillAlpha: mood === 'victory' ? 0.15 : 0.2,
    duration: 580,
  })
  const sigil = drawTempleSigil(
    scene,
    W / 2,
    H * 0.36,
    templeIdx,
    mood === 'victory' ? C.gold : C.neonRed,
    depth,
    0,
    1.15
  )
  scene.tweens.add({ targets: sigil, alpha: mood === 'victory' ? 0.18 : 0.1, duration: 760 })
  scene.tweens.add({
    targets: sigil,
    angle: mood === 'victory' ? 4 : -4,
    duration: 5200,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  })
}

// ══════════ MENU SCENE ═══════════════════════════
class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  preload() {
    preloadTempleParallax(this)
  }

  create() {
    const r = this.registry
    r.set('score', 0)
    r.set('lives', 3)
    r.set('templeIdx', 0)
    r.set('levelIdx', 0)
    r.set('paddleW', 140)
    r.set('ballSpd', 320)
    r.set('dropRate', 18)
    r.set('comboBon', 1)
    r.set('lastIntroTemple', -1)
    r.set('onboardingDone', false)
    r.set('mode', 'pro')

    this.cameras.main.setBackgroundColor(C.bg)
    playBgm('menu')

    createTempleAtmosphere(this, {
      templeIdx: 0,
      accent: C.gold,
      bgColor: C.bg,
      depth: -4,
      sigilY: 148,
      sigilScale: 1.08,
      columns: true,
      vignette: true,
    })

    this.drawColumn(55)
    this.drawColumn(W - 55)

    const title = this.add
      .text(W / 2, H * 0.25, 'NEON ODYSSEY', {
        fontFamily: 'Cinzel, serif',
        fontSize: '74px',
        color: '#fbbf24',
        stroke: '#7c3aed',
        strokeThickness: 3,
      })
      .setOrigin(0.5)

    const titleGlow = this.add
      .text(W / 2, H * 0.25, 'NEON ODYSSEY', {
        fontFamily: 'Cinzel, serif',
        fontSize: '74px',
        color: '#fde68a',
      })
      .setOrigin(0.5)
      .setAlpha(0.18)

    this.tweens.add({
      targets: title,
      scaleX: { from: 0.98, to: 1.02 },
      scaleY: { from: 0.98, to: 1.02 },
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    this.tweens.add({
      targets: titleGlow,
      alpha: { from: 0.08, to: 0.3 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    const tagline = this.add
      .text(W / 2, H * 0.32, 'Deflect destiny. Conquer Olympus.', {
        fontFamily: 'system-ui',
        fontSize: '18px',
        color: '#cbd5e1',
      })
      .setOrigin(0.5)
      .setShadow(0, 1, '#000000', 0.75, false, true)
      .setAlpha(0)

    const subtitle = this.add
      .text(W / 2, H * 0.38, 'A Greek Mythology Brick Breaker', {
        fontFamily: 'Cinzel, serif',
        fontSize: '22px',
        color: '#94a3b8',
      })
      .setOrigin(0.5)
      .setShadow(0, 1, '#000000', 0.75, false, true)
      .setAlpha(0)

    const featureLine = this.add
      .text(W / 2, H * 0.48, '⚡  3 Temples · 9 Levels · 4 God Powers  ⚡', {
        fontFamily: 'system-ui',
        fontSize: '18px',
        color: '#7dd3fc',
      })
      .setOrigin(0.5)
      .setShadow(0, 1, '#000000', 0.8, false, true)
      .setAlpha(0)

    // Hi-score display
    const hi = getHiScore()
    if (hi > 0) {
      this.add.text(W / 2, H * 0.55, `🏆 Best: ${hi}`, {
        fontFamily: 'system-ui', fontSize: '20px', color: '#fbbf24',
      }).setOrigin(0.5)
    }

    const start = this.add
      .text(W / 2, H * 0.65, '[ Press SPACE or Click to Begin ]', {
        fontFamily: 'system-ui',
        fontSize: '24px',
        color: '#e2e8f0',
      })
      .setOrigin(0.5)
      .setShadow(0, 2, '#000000', 0.9, false, true)
      .setAlpha(0)

    this.tweens.add({ targets: [tagline, subtitle], alpha: 1, duration: 500, delay: 120 })
    this.tweens.add({ targets: featureLine, alpha: 1, duration: 500, delay: 260 })
    this.tweens.add({ targets: start, alpha: 1, duration: 500, delay: 420 })

    this.tweens.add({
      targets: start,
      alpha: { from: 1, to: 0.25 },
      duration: 900,
      yoyo: true,
      repeat: -1,
    })

    this.add
      .text(W / 2, H * 0.78, 'Controls:  ← → Move  |  Space Launch  |  P Pause  |  R Restart', {
        fontFamily: 'system-ui',
        fontSize: '14px',
        color: '#64748b',
      })
      .setOrigin(0.5)
      .setShadow(0, 1, '#000000', 0.8, false, true)

    this.add
      .text(W / 2, H * 0.86, 'Z01 Athens Jam · Built with Phaser 3 + AI', {
        fontFamily: 'system-ui',
        fontSize: '13px',
        color: '#475569',
      })
      .setOrigin(0.5)
      .setShadow(0, 1, '#000000', 0.8, false, true)

    this.input.keyboard.once('keydown-SPACE', () => {
      getAudioCtx()
      playBgm('menu')
      this.go()
    })
    this.input.once('pointerdown', () => {
      getAudioCtx()
      playBgm('menu')
      this.go()
    })
  }

  drawColumn(x) {
    const g = this.add.graphics()
    g.fillStyle(C.gold, 0.045)
    g.fillRect(x - 16, 40, 32, H - 80)
    g.fillStyle(C.gold, 0.09)
    g.fillRect(x - 22, 40, 44, 14)
    g.fillRect(x - 22, H - 54, 44, 14)
    for (let y = 60; y < H - 60; y += 28) {
      g.fillStyle(C.gold, 0.025)
      g.fillRect(x - 10, y, 4, 18)
      g.fillRect(x + 6, y, 4, 18)
    }
  }

  go() {
    sfx(440, 880, 0.15, 0.05, 'triangle')
    this.cameras.main.fadeOut(350)
    this.time.delayedCall(350, () => this.scene.start('GameScene'))
  }

  update(_, delta) {
    advanceTempleParallax(this, delta)
  }
}

// ══════════ GAME SCENE ═══════════════════════════
class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  preload() {
    preloadTempleParallax(this)
  }

  create() {
    const r = this.registry
    this.score = r.get('score')
    this.lives = r.get('lives')
    this.templeIdx = r.get('templeIdx')
    this.levelIdx = r.get('levelIdx')
    this.basePaddleWidth = r.get('paddleW')
    this.baseBallSpeed = r.get('ballSpd')
    this.powerupChance = r.get('dropRate')
    this.comboMultiplierBonus = r.get('comboBon')
    this.mode = r.get('mode') || 'pro'

    this.currentPaddleWidth = this.basePaddleWidth
    this.combo = 0
    this.maxCombo = 0
    this.isRoundActive = false
    this.gameEnded = false
    this.paused = false
    this.fireballActive = false
    this.zeusActive = false
    this.athenaActive = false
    this.hermesActive = false
    this.fireballTimer = null
    this.zeusTimer = null
    this.athenaTimer = null
    this.hermesTimer = null
    this.fireballEnd = 0
    this.zeusEnd = 0
    this.athenaEnd = 0
    this.hermesEnd = 0
    this.totalBricks = 0
    this.glows = []
    this.stageBallSpeed = this.baseBallSpeed
    this.onboardingTimers = []
    this.lastComboCue = 0
    this.comboWindowMs = this.mode === 'pro' ? 1850 : 2500
    this.comboCarryMs = this.mode === 'pro' ? 700 : 950
    this.comboGrowthMs = this.mode === 'pro' ? 65 : 45
    this.comboScoreStep = this.mode === 'pro' ? 4 : 5
    this.proScoreBoost = this.mode === 'pro' ? 1.12 : 1
    this.comboExpireAt = 0

    this.temple = TEMPLES[this.templeIdx]

    this.cameras.main.setBackgroundColor(this.temple.bg)
    playBgm(`temple-${this.templeIdx}`)
    this.cameras.main.fadeIn(350)

    this.makeTextures()
    this.createDecorations()
    this.createPhysics()
    this.createHud()
    this.loadLevel()
    this.spawnBall(true)

    if (this.levelIdx === 0 && this.registry.get('lastIntroTemple') !== this.templeIdx) {
      this.showTempleIntro()
      this.registry.set('lastIntroTemple', this.templeIdx)
    }

    if (!this.registry.get('onboardingDone') && this.templeIdx === 0 && this.levelIdx === 0) {
      this.startOnboardingSequence()
    }
  }

  // ── TEXTURES ─────────────────────────────────
  makeTextures() {
    const t = this.temple
    const pw = this.basePaddleWidth

    const gen = (key, w, h, draw) => {
      if (this.textures.exists(key)) this.textures.remove(key)
      const g = this.add.graphics()
      draw(g)
      g.generateTexture(key, w, h)
      g.destroy()
    }

    gen('paddle', pw, 20, (g) => {
      g.fillStyle(C.gold, 1)
      g.fillRoundedRect(0, 0, pw, 20, 10)
      g.fillStyle(0xffffff, 0.12)
      g.fillRoundedRect(2, 1, pw - 4, 3, 2)
      g.fillStyle(C.goldBright, 0.35)
      g.fillRoundedRect(4, 2, pw - 8, 8, 5)
      g.fillStyle(0x000000, 0.18)
      g.fillRoundedRect(5, 11, pw - 10, 6, 4)
      g.lineStyle(1, 0xffffff, 0.28)
      g.strokeRoundedRect(1, 1, pw - 2, 18, 9)
    })

    gen('ball', 18, 18, (g) => {
      g.fillStyle(C.neonCyan, 0.2)
      g.fillCircle(9, 9, 9)
      g.fillStyle(C.neonCyan, 0.2)
      g.fillCircle(9, 9, 8)
      g.fillStyle(C.white, 0.98)
      g.fillCircle(9, 9, 7)
      g.fillStyle(C.neonCyan, 0.5)
      g.fillCircle(9, 9, 3)
      g.fillStyle(0xffffff, 0.7)
      g.fillCircle(6, 6, 2)
    })

    gen('brick1', BRICK_W, BRICK_H, (g) => {
      g.fillStyle(t.brickNormal, 1)
      g.fillRoundedRect(0, 0, BRICK_W, BRICK_H, 4)
      g.fillStyle(0xffffff, 0.12)
      g.fillRoundedRect(3, 2, BRICK_W - 6, 10, 3)
      g.fillStyle(0x000000, 0.2)
      g.fillRoundedRect(4, BRICK_H - 8, BRICK_W - 8, 5, 2)
      g.lineStyle(1, 0xffffff, 0.22)
      g.strokeRoundedRect(1, 1, BRICK_W - 2, BRICK_H - 2, 4)
    })

    gen('brick2', BRICK_W, BRICK_H, (g) => {
      g.fillStyle(t.brickStrong, 1)
      g.fillRoundedRect(0, 0, BRICK_W, BRICK_H, 4)
      g.fillStyle(0xffffff, 0.14)
      g.fillRoundedRect(3, 2, BRICK_W - 6, 10, 3)
      g.lineStyle(1, 0xffffff, 0.18)
      g.lineBetween(10, BRICK_H / 2, BRICK_W - 10, BRICK_H / 2)
      g.lineStyle(1, 0xffffff, 0.22)
      g.strokeRoundedRect(1, 1, BRICK_W - 2, BRICK_H - 2, 4)
      g.fillStyle(0xffffff, 0.08)
      g.fillCircle(BRICK_W / 2, BRICK_H / 2, 3)
    })

    gen('brick3', BRICK_W, BRICK_H, (g) => {
      g.fillStyle(t.brickMedusa, 1)
      g.fillRoundedRect(0, 0, BRICK_W, BRICK_H, 4)
      g.fillStyle(0xffffff, 0.1)
      g.fillRoundedRect(3, 2, BRICK_W - 6, 8, 3)
      g.fillStyle(0x000000, 0.35)
      g.fillCircle(BRICK_W / 2, BRICK_H / 2, 7)
      g.fillStyle(t.brickMedusa, 0.9)
      g.fillCircle(BRICK_W / 2, BRICK_H / 2, 4)
      g.lineStyle(1, 0xffffff, 0.25)
      g.strokeRoundedRect(1, 1, BRICK_W - 2, BRICK_H - 2, 4)
      g.lineStyle(1, 0xffffff, 0.14)
      g.lineBetween(BRICK_W / 2 - 11, BRICK_H / 2, BRICK_W / 2 + 11, BRICK_H / 2)
      g.lineBetween(BRICK_W / 2, BRICK_H / 2 - 8, BRICK_W / 2, BRICK_H / 2 + 8)
    })

    const pwColors = [C.neonCyan, C.neonGreen, C.neonOrange, C.neonPurple, C.gold]
    const pwGlyphs = [
      (g) => { g.lineStyle(2, 0xffffff, 0.9); g.lineBetween(14, 5, 11, 14); g.lineBetween(11, 14, 16, 14); g.lineBetween(16, 14, 13, 23) },
      (g) => { g.lineStyle(2, 0xffffff, 0.9); g.strokeCircle(14, 14, 6); g.lineBetween(14, 7, 14, 21) },
      (g) => { g.lineStyle(2, 0xffffff, 0.9); g.strokeRect(10, 9, 8, 10); g.lineBetween(10, 12, 18, 12) },
      (g) => { g.lineStyle(2, 0xffffff, 0.9); g.strokeCircle(14, 14, 6); g.lineBetween(8, 14, 20, 14) },
      (g) => {
        g.lineStyle(2, 0xffffff, 0.9)
        g.lineBetween(10, 15, 20, 15)
        g.lineBetween(9, 12, 19, 12)
        g.lineBetween(12, 18, 18, 18)
        g.lineBetween(20, 15, 23, 13)
      },
    ]
    const pwKeys = ['pw_zeus', 'pw_artemis', 'pw_heph', 'pw_athena', 'pw_hermes']
    pwKeys.forEach((key, i) => {
      gen(key, 28, 28, (g) => {
        g.fillStyle(pwColors[i], 1)
        g.fillCircle(14, 14, 14)
        g.fillStyle(C.white, 0.45)
        g.fillCircle(14, 12, 7)
        g.lineStyle(1, 0xffffff, 0.35)
        g.strokeCircle(14, 14, 13)
        pwGlyphs[i](g)
      })
    })
  }

  // ── DECORATIONS ──────────────────────────────
  createDecorations() {
    createTempleAtmosphere(this, {
      templeIdx: this.templeIdx,
      accent: this.temple.accent,
      bgColor: this.temple.bg,
      depth: -4,
      sigilY: 122,
      sigilScale: 1,
      columns: false,
      vignette: true,
    })
  }

  createTempleBackdrop() {
    const accent = this.temple.accent
    const layer = this.add.container(W / 2, 122).setDepth(1).setAlpha(0.22)
    const g = this.add.graphics()

    g.lineStyle(2, accent, 0.36)
    g.strokeCircle(0, 0, 92)
    g.lineStyle(1, C.neonCyan, 0.24)
    g.strokeCircle(0, 0, 68)

    if (this.templeIdx === 0) {
      g.lineStyle(2, accent, 0.34)
      g.lineBetween(-34, -8, 34, -8)
      g.strokeCircle(-22, -2, 7)
      g.strokeCircle(22, -2, 7)
      g.lineBetween(-18, 18, 0, 30)
      g.lineBetween(18, 18, 0, 30)
      g.lineBetween(-46, -44, -18, -64)
      g.lineBetween(46, -44, 18, -64)
    } else if (this.templeIdx === 1) {
      g.lineStyle(3, accent, 0.34)
      g.lineBetween(-58, 58, 58, -58)
      g.lineBetween(-58, -58, 58, 58)
      g.fillStyle(accent, 0.26)
      g.fillTriangle(-62, -62, -44, -58, -58, -44)
      g.fillTriangle(62, 62, 44, 58, 58, 44)
      g.fillTriangle(62, -62, 44, -58, 58, -44)
      g.fillTriangle(-62, 62, -44, 58, -58, 44)
    } else {
      g.lineStyle(3, accent, 0.34)
      g.lineBetween(-15, -56, 6, -20)
      g.lineBetween(6, -20, -7, -20)
      g.lineBetween(-7, -20, 12, 16)
      g.lineBetween(12, 16, -3, 16)
      g.lineBetween(-3, 16, 14, 56)
      g.lineStyle(1, C.neonCyan, 0.26)
      g.strokeCircle(0, 0, 44)
      g.strokeCircle(0, 0, 26)
    }

    layer.add(g)

    const halo = this.add.circle(W / 2, 122, 118, accent, 0.05).setDepth(0)
    this.tweens.add({
      targets: halo,
      alpha: { from: 0.03, to: 0.12 },
      scale: { from: 0.96, to: 1.05 },
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    this.tweens.add({
      targets: layer,
      angle: this.templeIdx === 1 ? -5 : 5,
      duration: 5200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  // ── PHYSICS ──────────────────────────────────
  createPhysics() {
    this.physics.world.setBoundsCollision(true, true, true, false)

    this.paddle = this.physics.add.image(W / 2, PADDLE_Y, 'paddle')
    this.paddle.setImmovable(true).setCollideWorldBounds(true).setDepth(5)
    this.paddle.body.allowGravity = false

    this.balls = this.physics.add.group({ maxSize: 20, runChildUpdate: false })
    this.bricks = this.physics.add.staticGroup()
    this.powerups = this.physics.add.group({ allowGravity: false })

    // Manual paddle bounce via overlap (prevents Arcade auto-reflection from fighting custom aim logic)
    this.physics.add.overlap(this.balls, this.paddle, this.onBallPaddle, undefined, this)
    this.brickCollider = this.physics.add.collider(this.balls, this.bricks, this.onBallBrick, undefined, this)
    this.brickOverlap = this.physics.add.overlap(this.balls, this.bricks, this.onBallBrickFireball, undefined, this)
    this.brickOverlap.active = false
    this.physics.add.overlap(this.paddle, this.powerups, this.collectPowerup, undefined, this)

    this.cursors = this.input.keyboard.createCursorKeys()
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
    this.input.on('pointerdown', () => {
      getAudioCtx()
      if (this.paused) return
      this.launchBall()
    })

    this.trailGfx = this.add.graphics().setDepth(3)

    // Pause overlay (hidden)
    this.pauseOverlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.6).setDepth(50).setVisible(false)
    this.pausePanel = this.add.rectangle(W / 2, H / 2, 470, 220, 0x0b1227, 0.88)
      .setDepth(51).setStrokeStyle(2, this.temple.accent, 0.5).setVisible(false)
    this.pausePanelGlow = this.add.rectangle(W / 2, H / 2 - 92, 460, 2, this.temple.accent, 0.7)
      .setDepth(51).setVisible(false)
    this.pauseText = this.add.text(W / 2, H / 2 - 20, 'PAUSED', {
      fontFamily: 'Cinzel, serif', fontSize: '52px', color: '#fbbf24',
      stroke: '#7c3aed', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(51).setVisible(false)
    this.pauseSub = this.add.text(W / 2, H / 2 + 40, 'Press P to resume', {
      fontFamily: 'system-ui', fontSize: '18px', color: '#94a3b8',
    }).setOrigin(0.5).setDepth(51).setVisible(false)
  }

  // ── HUD ──────────────────────────────────────
  createHud() {
    this.add.rectangle(W / 2, 33, W - 20, 56, 0x020617, 0.4).setDepth(9)
      .setStrokeStyle(1, this.temple.accent, 0.24)
    this.add.rectangle(W / 2, 5, W - 26, 2, this.temple.accent, 0.45).setDepth(10)
    this.add.rectangle(118, 33, 196, 44, 0x020617, 0.43).setDepth(9)
      .setStrokeStyle(1, this.temple.accent, 0.16)
    this.add.rectangle(W / 2, 37, 236, 28, 0x020617, 0.44).setDepth(9)
      .setStrokeStyle(1, C.neonCyan, 0.14)
    this.add.rectangle(W - 118, 33, 210, 44, 0x020617, 0.43).setDepth(9)
      .setStrokeStyle(1, this.temple.accent, 0.16)

    const s = { fontFamily: 'system-ui', fontSize: '18px', color: '#e2e8f0' }
    this.scoreText = this.add.text(16, 10, `Score: ${this.score}`, s).setDepth(10)
      .setShadow(0, 1, '#000000', 0.8, false, true)

    // Lives as hearts
    this.heartsText = this.add.text(16, 34, this.getHeartsString(), {
      fontFamily: 'system-ui', fontSize: '18px', color: '#ef4444',
    }).setDepth(10).setShadow(0, 1, '#000000', 0.8, false, true)

    // Hi-score in HUD
    this.hiScoreText = this.add.text(16, 56, `Best: ${getHiScore()}`, {
      fontFamily: 'system-ui', fontSize: '13px', color: '#64748b',
    }).setDepth(10).setShadow(0, 1, '#000000', 0.8, false, true)

    const accentHex = '#' + this.temple.accent.toString(16).padStart(6, '0')
    this.templeText = this.add
      .text(W / 2, 8, this.temple.name, {
        fontFamily: 'Cinzel, serif',
        fontSize: '18px',
        color: accentHex,
      })
      .setOrigin(0.5, 0)
      .setDepth(10)
      .setShadow(0, 1, '#000000', 0.8, false, true)

    const levelNum = this.templeIdx * 3 + this.levelIdx + 1
    this.levelText = this.add.text(W - 16, 10, `Level ${levelNum}`, s).setOrigin(1, 0).setDepth(10)
      .setShadow(0, 1, '#000000', 0.8, false, true)

    this.stageMetaText = this.add.text(W - 16, 34, '', {
      fontFamily: 'system-ui', fontSize: '13px', color: '#94a3b8',
    }).setOrigin(1, 0).setDepth(10).setShadow(0, 1, '#000000', 0.8, false, true)

    this.comboGaugeLabel = this.add.text(W / 2, 24, 'CHAIN', {
      fontFamily: 'system-ui', fontSize: '12px', color: '#93c5fd',
    }).setOrigin(0.5).setDepth(10).setShadow(0, 1, '#000000', 0.8, false, true)

    this.comboGaugeBg = this.add.rectangle(W / 2 - 100, 43, 200, 8, 0x0f172a, 0.85)
      .setOrigin(0, 0.5).setDepth(10)
      .setStrokeStyle(1, C.neonCyan, 0.25)

    this.comboGaugeFill = this.add.rectangle(W / 2 - 100, 43, 0, 8, C.neonCyan, 0.92)
      .setOrigin(0, 0.5).setDepth(10)

    // Level progress bar
    this.progressBg = this.add.rectangle(W / 2, H - 9, W - 120, 7, 0x1e293b, 0.72).setDepth(10)
      .setStrokeStyle(1, this.temple.accent, 0.25)
    this.progressBar = this.add.rectangle(60, H - 9, 0, 7, C.neonCyan, 0.86).setOrigin(0, 0.5).setDepth(10)
    this.progressShine = this.add.rectangle(60, H - 11, 0, 2, 0xffffff, 0.32).setOrigin(0, 0.5).setDepth(10)

    // Powerup timer bars
    this.timerBarGfx = this.add.graphics().setDepth(10)

    this.comboText = this.add
      .text(W / 2, H / 2 - 50, '', {
        fontFamily: 'system-ui',
        fontSize: '38px',
        color: '#fbbf24',
        stroke: '#000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(10)
      .setAlpha(0)

    this.comboTextGlow = this.add
      .text(W / 2, H / 2 - 50, '', {
        fontFamily: 'system-ui',
        fontSize: '38px',
        color: '#fde68a',
      })
      .setOrigin(0.5)
      .setDepth(9)
      .setAlpha(0)

    this.infoText = this.add
      .text(W / 2, H / 2 + 20, 'Press SPACE or Click to launch', {
        fontFamily: 'system-ui',
        fontSize: '22px',
        color: '#e2e8f0',
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(10)
      .setShadow(0, 2, '#000000', 0.9, false, true)

    this.powerupStatus = this.add
      .text(W - 16, 54, '', {
        fontFamily: 'system-ui',
        fontSize: '14px',
        color: '#a3e635',
      })
      .setOrigin(1, 0)
      .setDepth(10)
      .setShadow(0, 1, '#000000', 0.9, false, true)

    // Flash overlay for big combos
    this.flashOverlay = this.add.rectangle(W / 2, H / 2, W, H, C.white, 0).setDepth(20)

    this.endText = this.add
      .text(W / 2, H / 2 + 70, '', {
        fontFamily: 'Cinzel, serif',
        fontSize: '26px',
        color: '#ffd166',
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(10)
  }

  // ── LEVEL LOADING ────────────────────────────
  loadLevel() {
    this.bricks.clear(true, true)
    this.powerups.clear(true, true)
    this.glows.forEach((g) => g.destroy())
    this.glows = []

    const temple = TEMPLES[this.templeIdx]
    const map = temple.levels[this.levelIdx]
    const totalW = BRICK_COLS * BRICK_W + (BRICK_COLS - 1) * BRICK_GAP
    const startX = (W - totalW) / 2 + BRICK_W / 2
    const startY = BRICK_START_Y

    map.forEach((row, r) => {
      ;[...row].forEach((ch, c) => {
        if (ch === '.' || ch === ' ') return
        const x = startX + c * (BRICK_W + BRICK_GAP)
        const y = startY + r * (BRICK_H + BRICK_GAP)
        const type = Number(ch)
        const tex = type === 1 ? 'brick1' : type === 2 ? 'brick2' : 'brick3'
        const hp = type === 2 ? 2 : 1

        const glowColor =
          type === 3 ? temple.brickMedusa : type === 2 ? temple.brickStrong : temple.brickNormal
        const glow = this.add.rectangle(x, y, BRICK_W + 6, BRICK_H + 6, glowColor, 0.12).setDepth(1)
        this.glows.push(glow)

        const brick = this.bricks.create(x, y, tex)
        brick.setDepth(2)
        brick.setData('hp', hp)
        brick.setData('type', type)
        brick.setData('glow', glow)
        brick.setScale(0.85)
        brick.setAlpha(0)
        this.tweens.add({
          targets: brick,
          alpha: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 220,
          delay: r * 24 + c * 9,
          ease: 'Back.easeOut',
        })
      })
    })

    const levelNum = this.templeIdx * 3 + this.levelIdx + 1
    const stageScale = 1 + ((levelNum - 1) * (this.mode === 'pro' ? 0.04 : 0.035))
    this.stageBallSpeed = Phaser.Math.Clamp(
      Math.round(this.baseBallSpeed * stageScale),
      this.baseBallSpeed,
      Math.round(this.baseBallSpeed * (this.mode === 'pro' ? 1.38 : 1.32))
    )

    this.levelText.setText(`Level ${levelNum}`)
    this.templeText.setText(temple.name)
    this.totalBricks = this.bricks.countActive(true)
    this.updateProgressBar()
  }

  showTempleIntro() {
    const overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0).setDepth(60)
    const title = this.add.text(W / 2, H / 2 - 24, this.temple.name, {
      fontFamily: 'Cinzel, serif', fontSize: '44px', color: '#fbbf24',
      stroke: '#7c3aed', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(61).setAlpha(0)

    const lore = this.add.text(W / 2, H / 2 + 26, TEMPLE_LORE[this.templeIdx] || '', {
      fontFamily: 'system-ui', fontSize: '20px', color: '#cbd5e1', align: 'center',
      wordWrap: { width: 760 },
    }).setOrigin(0.5).setDepth(61).setAlpha(0)

    this.tweens.add({ targets: overlay, fillAlpha: 0.68, duration: 280 })
    this.tweens.add({ targets: [title, lore], alpha: 1, duration: 320, delay: 120 })

    this.time.delayedCall(2400, () => {
      this.tweens.add({
        targets: [overlay, title, lore],
        alpha: 0,
        fillAlpha: 0,
        duration: 320,
        onComplete: () => {
          overlay.destroy()
          title.destroy()
          lore.destroy()
        },
      })
    })

    sfx(360 + this.templeIdx * 80, 780 + this.templeIdx * 120, 0.22, 0.05, 'triangle')
  }

  getHeartsString() {
    return '♥'.repeat(Math.max(0, this.lives))
  }

  updateProgressBar() {
    const remaining = this.bricks.countActive(true)
    const progress = this.totalBricks > 0 ? 1 - (remaining / this.totalBricks) : 0
    const barW = W - 120
    this.progressBar.width = barW * progress
    this.progressShine.width = barW * progress
    // Color shifts from cyan to green to gold as you progress
    if (progress > 0.8) this.progressBar.setFillStyle(C.gold, 0.9)
    else if (progress > 0.5) this.progressBar.setFillStyle(C.neonGreen, 0.8)
    else this.progressBar.setFillStyle(C.neonCyan, 0.8)

    const spd = Math.round(this.stageBallSpeed)
    const modeTag = this.mode === 'pro' ? 'PRO' : 'CLASSIC'
    this.stageMetaText.setText(`Bricks: ${remaining}  |  Speed: ${spd}  |  ${modeTag}`)
  }

  drawTimerBars() {
    this.timerBarGfx.clear()
    const now = this.time.now
    const bars = []
    if (this.zeusActive && this.zeusEnd > now) bars.push({ label: '⚡', color: C.neonCyan, pct: (this.zeusEnd - now) / 8000 })
    if (this.fireballActive && this.fireballEnd > now) bars.push({ label: '🔥', color: C.neonOrange, pct: (this.fireballEnd - now) / 5000 })
    if (this.athenaActive && this.athenaEnd > now) bars.push({ label: '🛡', color: C.neonPurple, pct: (this.athenaEnd - now) / 10000 })
    if (this.hermesActive && this.hermesEnd > now) bars.push({ label: '🪽', color: C.gold, pct: (this.hermesEnd - now) / 7000 })
    bars.forEach((b, i) => {
      const bx = W - 180
      const by = 76 + i * 16
      this.timerBarGfx.fillStyle(0x1e293b, 0.7)
      this.timerBarGfx.fillRoundedRect(bx, by, 160, 10, 3)
      this.timerBarGfx.fillStyle(b.color, 0.85)
      this.timerBarGfx.fillRoundedRect(bx, by, Math.max(4, 160 * b.pct), 10, 3)
    })
  }

  // ── BALL ─────────────────────────────────────
  spawnBall(stuck = false) {
    const ball = this.balls.create(this.paddle.x, this.paddle.y - 22, 'ball')
    if (!ball) return null
    ball.setCircle(7, 2, 2)
    ball.setBounce(1, 1)
    ball.setCollideWorldBounds(true)
    ball.setDepth(4)
    ball.setData('stuck', stuck)
    ball.setData('trail', [])
    ball.setData('lastPaddleHit', 0)

    if (stuck) {
      ball.setVelocity(0, 0)
    } else {
      ball.setVelocity(Phaser.Math.Between(-180, 180), -this.stageBallSpeed)
      this.isRoundActive = true
    }
    if (this.fireballActive) ball.setTint(C.neonOrange)
    return ball
  }

  startOnboardingSequence() {
    this.clearOnboardingSequence()
    this.infoText.setVisible(true)

    const tips = [
      'Tip: Move before launch to curve your opening angle',
      'Control: Hit paddle edges for sharper rebounds',
      'Strategy: Keep combos alive for huge score spikes',
      'Power: Catch divine drops to control momentum',
    ]

    tips.forEach((tip, i) => {
      const timer = this.time.delayedCall(i * 5600, () => {
        if (this.gameEnded || this.registry.get('onboardingDone')) return
        this.infoText.setText(tip).setVisible(true).setAlpha(0)
        this.tweens.add({ targets: this.infoText, alpha: 1, duration: 180 })
      })
      this.onboardingTimers.push(timer)
    })
  }

  clearOnboardingSequence() {
    this.onboardingTimers.forEach((timer) => timer.remove(false))
    this.onboardingTimers = []
  }

  launchBall() {
    if (this.gameEnded) return
    const stuck = this.balls.getChildren().find((b) => b.active && b.getData('stuck'))
    if (!stuck) return
    stuck.setData('stuck', false)

    // Launch direction follows paddle movement (classic Arkanoid style)
    const paddleVx = this.paddle.body.velocity.x
    const influence = Phaser.Math.Clamp(paddleVx / 540, -1, 1)
    const launchAngle = Phaser.Math.DegToRad(-90 + influence * 45)
    stuck.setVelocity(
      Math.cos(launchAngle) * this.stageBallSpeed,
      Math.sin(launchAngle) * this.stageBallSpeed
    )

    this.isRoundActive = true
    this.infoText.setVisible(false)
    if (!this.registry.get('onboardingDone')) {
      this.registry.set('onboardingDone', true)
      this.clearOnboardingSequence()
    }
    this.combo = 0
    sfx(340, 580, 0.1, 0.05, 'triangle')
  }

  // ── PADDLE HIT ───────────────────────────────
  onBallPaddle(ball, paddle) {
    if (ball.getData('stuck')) return

    // Ignore side/back overlaps; only handle real top hits while descending
    if (ball.body.velocity.y <= 0) return

    const now = this.time.now
    if (now - (ball.getData('lastPaddleHit') || 0) < 70) return
    ball.setData('lastPaddleHit', now)

    // Push ball above paddle to avoid repeated overlap callbacks
    ball.y = paddle.y - paddle.displayHeight / 2 - ball.displayHeight / 2 - 2

    // Arkanoid hit mapping: -1 (left) .. 0 (center) .. +1 (right)
    const halfW = paddle.displayWidth / 2
    const hit = Phaser.Math.Clamp((ball.x - paddle.x) / halfW, -1, 1)

    // Slight curve keeps center controllable while making edge hits aggressive
    const sign = hit < 0 ? -1 : 1
    const curved = sign * Math.pow(Math.abs(hit), 1.35)
    const maxAngle = 80
    const angle = Phaser.Math.DegToRad(-90 + curved * maxAngle)

    // Keep speed deterministic: no per-hit acceleration
    const speed = this.stageBallSpeed
    let vx = Math.cos(angle) * speed

    // Add controlled paddle movement influence for skill expression
    vx += paddle.body.velocity.x * 0.12
    vx = Phaser.Math.Clamp(vx, -speed * 0.96, speed * 0.96)
    const vy = -Math.sqrt(Math.max(1, speed * speed - vx * vx))

    ball.setVelocity(vx, vy)

    this.tweens.killTweensOf(paddle)
    paddle.setScale(1, 1)
    this.tweens.add({
      targets: paddle,
      scaleX: 1.04,
      scaleY: 0.96,
      duration: 68,
      yoyo: true,
      ease: 'Sine.easeOut',
    })

    // Preserve combo chains across paddle touches to reward controlled rallies.
    // Skilled players can now route shots and keep momentum alive.
    if (this.combo > 0) {
      this.comboExpireAt = Math.max(this.comboExpireAt, this.time.now + this.comboCarryMs)
      this.updateComboDisplay()
    }
    sfx(300, 220, 0.05, 0.04, 'square')
  }

  preventPaddlePassThrough(ball) {
    if (!ball.active || ball.getData('stuck')) return
    if (ball.body.velocity.y <= 0) return

    const prevY = ball.getData('prevY')
    if (prevY === undefined) return

    const paddleTop = this.paddle.y - this.paddle.displayHeight / 2
    const ballRadius = (ball.displayHeight || 14) / 2
    const hitLine = paddleTop - ballRadius

    // Ball crossed the paddle top line this frame
    const crossed = prevY <= hitLine && ball.y >= hitLine
    if (!crossed) return

    // Horizontal overlap check (slightly generous to avoid edge tunneling)
    const halfW = this.paddle.displayWidth / 2
    const insideX = Math.abs(ball.x - this.paddle.x) <= (halfW + ballRadius)
    if (!insideX) return

    this.onBallPaddle(ball, this.paddle)
  }

  // ── BRICK HIT (normal) ──────────────────────
  onBallBrick(ball, brick) {
    if (!brick.active) return
    const now = this.time.now
    if (this.combo > 0 && now > this.comboExpireAt) this.combo = 0

    let hp = brick.getData('hp') - 1
    brick.setData('hp', hp)
    if (hp <= 0) {
      this.destroyBrick(brick)
      if (this.zeusActive) this.chainLightning(brick.x, brick.y)
    } else {
      brick.setTexture('brick1')
      brick.setAlpha(0.7)
      sfx(430, 320, 0.04, 0.03, 'square')
    }
    this.combo += 1
    this.comboExpireAt = now + this.comboWindowMs + Math.min(1000, this.combo * this.comboGrowthMs)
    if (this.combo > this.maxCombo) this.maxCombo = this.combo
    this.updateComboDisplay()

    // No per-brick acceleration: keep control deterministic and skill-based.
  }

  // ── BRICK HIT (fireball pass-through) ───────
  onBallBrickFireball(ball, brick) {
    if (!brick.active) return
    const now = this.time.now
    if (this.combo > 0 && now > this.comboExpireAt) this.combo = 0
    if ((brick.getData('lastFireHit') || 0) > now - 120) return
    brick.setData('lastFireHit', now)

    let hp = brick.getData('hp') - 1
    brick.setData('hp', hp)
    if (hp <= 0) {
      this.destroyBrick(brick)
      if (this.zeusActive) this.chainLightning(brick.x, brick.y)
    } else {
      brick.setTexture('brick1')
      brick.setAlpha(0.7)
    }
    this.combo += 1
    this.comboExpireAt = now + this.comboWindowMs + Math.min(1000, this.combo * this.comboGrowthMs)
    if (this.combo > this.maxCombo) this.maxCombo = this.combo
    this.updateComboDisplay()
  }

  // ── DESTROY BRICK ────────────────────────────
  destroyBrick(brick, allowExplosion = true) {
    const type = brick.getData('type')
    const x = brick.x
    const y = brick.y
    const glow = brick.getData('glow')
    if (glow) glow.destroy()

    const baseScore = type === 1 ? 100 : type === 2 ? 200 : 300
    const comboTier = Math.floor(this.combo / this.comboScoreStep)
    const multiplier = this.proScoreBoost * (1 + comboTier * this.comboMultiplierBonus)
    const points = Math.round(baseScore * multiplier)
    this.score += points
    this.scoreText.setText(`Score: ${this.score}`)

    if (this.combo >= 4) {
      const ft = this.add
        .text(x, y, `+${points}`, {
          fontFamily: 'system-ui',
          fontSize: '16px',
          color: '#fbbf24',
        })
        .setOrigin(0.5)
        .setDepth(10)
      this.tweens.add({
        targets: ft,
        y: y - 36,
        alpha: 0,
        duration: 550,
        onComplete: () => ft.destroy(),
      })
    }

    brick.disableBody(true, true)

    // Brick destruction particles
    this.spawnBrickParticles(x, y, type)
    this.updateProgressBar()

    if (type === 3 && allowExplosion) {
      this.explodeNearby(x, y)
      sfx(140, 50, 0.18, 0.06, 'sawtooth')
      this.cameras.main.shake(80, 0.004)
    } else {
      sfx(520, 260, 0.07, 0.04, 'triangle')
      this.cameras.main.shake(50, 0.002)
    }

    // Flash on big combos
    if (this.combo >= 8) {
      this.flashOverlay.setAlpha(0.15)
      this.tweens.add({ targets: this.flashOverlay, alpha: 0, duration: 200 })
    }

    if (Phaser.Math.Between(1, 100) <= this.powerupChance) {
      this.dropPowerup(x, y)
    }

    if (this.bricks.countActive(true) === 0) {
      this.levelComplete()
    }
  }

  explodeNearby(x, y) {
    const radius = BRICK_W + BRICK_GAP + 10
    const targets = []
    this.bricks.getChildren().forEach((b) => {
      if (!b.active) return
      if (Phaser.Math.Distance.Between(x, y, b.x, b.y) <= radius) targets.push(b)
    })
    targets.forEach((b) => {
      const hp = (b.getData('hp') ?? 1) - 1
      b.setData('hp', hp)
      if (hp <= 0) this.destroyBrick(b, false)
      else {
        b.setTexture('brick1')
        b.setAlpha(0.7)
      }
    })
  }

  chainLightning(x, y) {
    const sorted = []
    this.bricks.getChildren().forEach((b) => {
      if (!b.active) return
      sorted.push({ brick: b, dist: Phaser.Math.Distance.Between(x, y, b.x, b.y) })
    })
    sorted.sort((a, b) => a.dist - b.dist)
    const hits = sorted.slice(0, 2)
    hits.forEach(({ brick }, i) => {
      const line = this.add.graphics().setDepth(8)
      line.lineStyle(2, C.neonCyan, 0.8)
      line.lineBetween(x, y, brick.x, brick.y)
      this.time.delayedCall(160, () => line.destroy())
      this.time.delayedCall(50 * (i + 1), () => {
        if (!brick.active) return
        const hp = brick.getData('hp') - 1
        brick.setData('hp', hp)
        if (hp <= 0) this.destroyBrick(brick, false)
        else {
          brick.setTexture('brick1')
          brick.setAlpha(0.7)
        }
        sfx(800 + i * 200, 1200, 0.06, 0.03, 'sine')
      })
    })
  }

  // ── POWERUPS ─────────────────────────────────
  dropPowerup(x, y) {
    const types = ['zeus', 'artemis', 'heph', 'athena', 'hermes']
    const type = types[Phaser.Math.Between(0, types.length - 1)]
    const pw = this.powerups.create(x, y, `pw_${type}`)
    pw.setData('type', type)
    pw.setVelocity(0, 120)
    pw.setDepth(6)
    this.tweens.add({ targets: pw, angle: 360, duration: 2000, repeat: -1 })
  }

  collectPowerup(paddle, pw) {
    if (!pw.active) return
    const type = pw.getData('type')
    const x = pw.x
    const y = pw.y
    pw.disableBody(true, true)
    sfx(680, 1000, 0.12, 0.05, 'triangle')

    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(x, y, Phaser.Math.Between(2, 4), C.white, 0.95).setDepth(12)
      const ang = Phaser.Math.FloatBetween(0, Math.PI * 2)
      const dist = Phaser.Math.Between(26, 62)
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(ang) * dist,
        y: y + Math.sin(ang) * dist,
        alpha: 0,
        scale: 0.3,
        duration: Phaser.Math.Between(240, 420),
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      })
    }

    if (type === 'zeus') this.activateZeus()
    else if (type === 'artemis') this.activateArtemis()
    else if (type === 'heph') this.activateFireball()
    else if (type === 'athena') this.activateAthena()
    else if (type === 'hermes') this.activateHermes()
  }

  spawnBrickParticles(x, y, type) {
    const t = this.temple
    const color = type === 3 ? t.brickMedusa : type === 2 ? t.brickStrong : t.brickNormal
    const count = type === 3 ? 16 : 10
    for (let i = 0; i < count; i++) {
      const px = x + Phaser.Math.Between(-BRICK_W / 2, BRICK_W / 2)
      const py = y + Phaser.Math.Between(-BRICK_H / 2, BRICK_H / 2)
      const size = Phaser.Math.Between(2, 6)
      const p = this.add.rectangle(px, py, size, size, color, 1).setDepth(7)
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
      const spd = Phaser.Math.Between(60, 180)
      this.tweens.add({
        targets: p,
        x: px + Math.cos(angle) * spd,
        y: py + Math.sin(angle) * spd + Phaser.Math.Between(20, 60),
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        angle: Phaser.Math.Between(-180, 180),
        duration: Phaser.Math.Between(300, 600),
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy(),
      })

      if (i < 4) {
        const spark = this.add.circle(px, py, Phaser.Math.Between(1, 2), C.white, 0.95).setDepth(8)
        this.tweens.add({
          targets: spark,
          alpha: 0,
          scale: 0.2,
          x: px + Phaser.Math.Between(-30, 30),
          y: py + Phaser.Math.Between(-30, 30),
          duration: Phaser.Math.Between(220, 380),
          onComplete: () => spark.destroy(),
        })
      }
    }
  }

  activateZeus() {
    this.zeusActive = true
    this.zeusEnd = this.time.now + 8000
    if (this.zeusTimer) this.zeusTimer.remove(false)
    this.zeusTimer = this.time.delayedCall(8000, () => {
      this.zeusActive = false
      this.updatePowerupStatus()
    })
    this.updatePowerupStatus()
  }

  activateArtemis() {
    const existing = this.balls.getChildren().filter((b) => b.active && !b.getData('stuck'))
    existing.forEach((ball) => {
      if (!ball.body) return
      const b1 = this.spawnBall(false)
      const b2 = this.spawnBall(false)
      if (b1) {
        b1.x = ball.x
        b1.y = ball.y
        b1.setVelocity(-ball.body.velocity.x, ball.body.velocity.y)
      }
      if (b2) {
        b2.x = ball.x
        b2.y = ball.y
        b2.setVelocity(ball.body.velocity.x * 0.6, -Math.abs(ball.body.velocity.y))
      }
    })
    sfx(550, 880, 0.1, 0.05, 'sine')
  }

  activateFireball() {
    this.fireballActive = true
    this.fireballEnd = this.time.now + 5000
    this.brickCollider.active = false
    this.brickOverlap.active = true
    this.balls.getChildren().forEach((b) => {
      if (b.active) b.setTint(C.neonOrange)
    })
    if (this.fireballTimer) this.fireballTimer.remove(false)
    this.fireballTimer = this.time.delayedCall(5000, () => {
      this.fireballActive = false
      this.brickCollider.active = true
      this.brickOverlap.active = false
      this.balls.getChildren().forEach((b) => {
        if (b.active) b.clearTint()
      })
      this.updatePowerupStatus()
    })
    this.updatePowerupStatus()
    sfx(200, 100, 0.15, 0.06, 'sawtooth')
  }

  activateAthena() {
    this.currentPaddleWidth = Math.min(240, this.basePaddleWidth + 60)
    this.paddle.setDisplaySize(this.currentPaddleWidth, 20)
    this.paddle.body.setSize(this.currentPaddleWidth, 20)
    this.athenaActive = true
    this.athenaEnd = this.time.now + 10000
    if (this.athenaTimer) this.athenaTimer.remove(false)
    this.athenaTimer = this.time.delayedCall(10000, () => {
      this.athenaActive = false
      this.currentPaddleWidth = this.basePaddleWidth
      this.paddle.setDisplaySize(this.basePaddleWidth, 20)
      this.paddle.body.setSize(this.basePaddleWidth, 20)
      this.updatePowerupStatus()
    })
    this.updatePowerupStatus()
    sfx(440, 660, 0.1, 0.04, 'sine')
  }

  activateHermes() {
    this.hermesActive = true
    this.hermesEnd = this.time.now + 7000
    if (this.hermesTimer) this.hermesTimer.remove(false)
    this.hermesTimer = this.time.delayedCall(7000, () => {
      this.hermesActive = false
      this.updatePowerupStatus()
    })

    const ring = this.add.circle(this.paddle.x, this.paddle.y - 8, 10, C.gold, 0.45).setDepth(12)
    this.tweens.add({
      targets: ring,
      radius: 120,
      alpha: 0,
      duration: 420,
      ease: 'Quad.easeOut',
      onComplete: () => ring.destroy(),
    })
    this.cameras.main.flash(140, 250, 220, 120)
    this.updatePowerupStatus()
    sfx(780, 1280, 0.1, 0.04, 'triangle')
  }

  updatePowerupStatus() {
    const parts = []
    if (this.zeusActive) parts.push('⚡ Zeus')
    if (this.fireballActive) parts.push('🔥 Fire')
    if (this.athenaActive) parts.push('🛡 Athena')
    if (this.hermesActive) parts.push('🪽 Hermes')
    this.powerupStatus.setText(parts.join('  '))
  }

  // ── COMBO ────────────────────────────────────
  updateComboDisplay() {
    if (this.combo >= 3) {
      this.comboText.setText(`${this.combo}x Combo!`)
      this.comboTextGlow.setText(`${this.combo}x Combo!`)
      this.comboText.setAlpha(1)
      this.comboTextGlow.setAlpha(0.28)
      this.comboText.setScale(0.5)
      this.comboTextGlow.setScale(0.56)
      this.tweens.killTweensOf(this.comboText)
      this.tweens.killTweensOf(this.comboTextGlow)
      this.tweens.add({
        targets: this.comboText,
        scaleX: 1,
        scaleY: 1,
        duration: 110,
        ease: 'Back.easeOut',
      })
      this.tweens.add({
        targets: this.comboTextGlow,
        scaleX: 1.1,
        scaleY: 1.1,
        alpha: { from: 0.28, to: 0.08 },
        duration: 120,
        ease: 'Quad.easeOut',
      })
      if (this.combo >= 10) this.comboText.setColor('#ef4444')
      else if (this.combo >= 5) this.comboText.setColor('#f97316')
      else this.comboText.setColor('#fbbf24')

      const cueTier = this.combo >= 10 ? 3 : this.combo >= 7 ? 2 : this.combo >= 5 ? 1 : 0
      if (cueTier > this.lastComboCue) {
        const start = cueTier === 1 ? 700 : cueTier === 2 ? 860 : 980
        sfx(start, start + 280, 0.08, 0.04, 'triangle')
        const flashAlpha = cueTier === 1 ? 0.04 : cueTier === 2 ? 0.06 : 0.08
        this.flashOverlay.setAlpha(flashAlpha)
        this.tweens.killTweensOf(this.flashOverlay)
        this.tweens.add({ targets: this.flashOverlay, alpha: 0, duration: 140 })
        this.lastComboCue = cueTier
      }
    } else {
      this.tweens.killTweensOf(this.comboText)
      this.tweens.killTweensOf(this.comboTextGlow)
      this.tweens.add({ targets: this.comboText, alpha: 0, duration: 180 })
      this.tweens.add({ targets: this.comboTextGlow, alpha: 0, duration: 180 })
      this.lastComboCue = 0
    }

    const maxW = 200
    if (this.combo > 0) {
      const remaining = Math.max(0, this.comboExpireAt - this.time.now)
      const pct = Phaser.Math.Clamp(remaining / this.comboWindowMs, 0, 1)
      this.comboGaugeFill.width = Math.max(4, maxW * pct)
      if (this.combo >= 10) this.comboGaugeFill.setFillStyle(C.neonRed, 0.92)
      else if (this.combo >= 6) this.comboGaugeFill.setFillStyle(C.neonOrange, 0.92)
      else this.comboGaugeFill.setFillStyle(C.neonCyan, 0.92)
      this.comboGaugeLabel.setText(`CHAIN ${this.combo}x`)
    } else {
      this.comboGaugeFill.width = 0
      this.comboGaugeLabel.setText('CHAIN')
    }
  }

  // ── LEVEL FLOW ───────────────────────────────
  levelComplete() {
    this.isRoundActive = false
    this.balls.clear(true, true)
    this.clearPowerupEffects()
    sfx(440, 880, 0.2, 0.06, 'triangle')

    this.saveState()
    if (this.score > getHiScore()) setHiScore(this.score)
    this.hiScoreText.setText(`Best: ${getHiScore()}`)
    const nextLevelIdx = this.levelIdx + 1

    if (nextLevelIdx >= 3) {
      const nextTemple = this.templeIdx + 1
      if (nextTemple >= TEMPLES.length) {
        this.gameEnded = true
        if (this.score > getHiScore()) setHiScore(this.score)
        this.showVictoryScreen()
        sfx(440, 1320, 0.3, 0.07, 'triangle')
        return
      }
      this.registry.set('templeIdx', nextTemple)
      this.registry.set('levelIdx', 0)
      this.registry.set('score', this.score)
      this.registry.set('lives', this.lives)
      this.cameras.main.fadeOut(500)
      this.time.delayedCall(500, () => this.scene.start('UpgradeScene'))
      return
    }

    this.levelIdx = nextLevelIdx
    this.registry.set('levelIdx', nextLevelIdx)
    this.showLevelTransition()
  }

  showLevelTransition() {
    const levelNum = this.templeIdx * 3 + this.levelIdx + 1
    const banner = this.add.text(W / 2, H / 2, `Level ${levelNum}`, {
      fontFamily: 'Cinzel, serif', fontSize: '48px', color: '#fbbf24',
      stroke: '#7c3aed', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(30).setAlpha(0).setScale(0.5)

    const briefing = this.add.text(W / 2, H / 2 + 48, 'Prepare your launch and keep the chain alive.', {
      fontFamily: 'system-ui', fontSize: '18px', color: '#cbd5e1',
      align: 'center',
    }).setOrigin(0.5).setDepth(30).setAlpha(0)

    this.tweens.add({
      targets: [banner, briefing],
      alpha: 1, scaleX: 1, scaleY: 1,
      duration: 400, ease: 'Back.easeOut',
      onComplete: () => {
        this.time.delayedCall(2400, () => {
          this.tweens.add({
            targets: [banner, briefing], alpha: 0, y: '-=22', duration: 360,
            onComplete: () => {
              banner.destroy()
              briefing.destroy()
              if (this.gameEnded) return
              this.loadLevel()
              this.spawnBall(true)
              this.infoText.setText('Press SPACE or Click to launch').setVisible(true)
            },
          })
        })
      },
    })

    sfx(420 + this.templeIdx * 60, 760 + this.levelIdx * 80, 0.14, 0.04, 'triangle')
  }

  showVictoryScreen() {
    playBgm('victory')
    addEndScreenBackdrop(this, { templeIdx: this.templeIdx, accent: this.temple.accent, mood: 'victory', depth: 39 })
    const overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0).setDepth(40)
    this.tweens.add({ targets: overlay, fillAlpha: 0.7, duration: 600 })

    for (let i = 0; i < 40; i++) {
      const p = this.add.rectangle(
        Phaser.Math.Between(40, W - 40),
        Phaser.Math.Between(-140, -10),
        Phaser.Math.Between(4, 8),
        Phaser.Math.Between(6, 12),
        Phaser.Utils.Array.GetRandom([C.gold, C.neonCyan, C.neonPurple, C.neonGreen]),
        0.95
      ).setDepth(42)
      this.tweens.add({
        targets: p,
        y: H + 60,
        x: p.x + Phaser.Math.Between(-80, 80),
        angle: Phaser.Math.Between(-360, 360),
        alpha: { from: 1, to: 0.3 },
        duration: Phaser.Math.Between(1200, 2400),
        ease: 'Quad.easeIn',
        onComplete: () => p.destroy(),
      })
    }

    const trophy = this.add.text(W / 2, H / 2 - 80, '🏆', { fontSize: '72px' })
      .setOrigin(0.5).setDepth(41).setAlpha(0).setScale(0)
    this.tweens.add({
      targets: trophy, alpha: 1, scaleX: 1, scaleY: 1,
      duration: 600, delay: 300, ease: 'Back.easeOut',
    })

    const title = this.add.text(W / 2, H / 2, 'OLYMPUS CONQUERED', {
      fontFamily: 'Cinzel, serif', fontSize: '38px', color: '#fbbf24',
      stroke: '#7c3aed', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(41).setAlpha(0)
    this.tweens.add({ targets: title, alpha: 1, duration: 400, delay: 600 })

    const scoreStr = `Score: ${this.score}` + (this.score >= getHiScore() ? '  ★ NEW BEST!' : `  |  Best: ${getHiScore()}`)
    const scoreText = this.add.text(W / 2, H / 2 + 50, scoreStr, {
      fontFamily: 'system-ui', fontSize: '22px', color: '#e2e8f0',
    }).setOrigin(0.5).setDepth(41).setAlpha(0).setShadow(0, 2, '#000000', 0.9, false, true)
    this.tweens.add({ targets: scoreText, alpha: 1, duration: 400, delay: 900 })

    const stats = this.add.text(W / 2, H / 2 + 84, `Max Combo: ${this.maxCombo}`, {
      fontFamily: 'system-ui', fontSize: '16px', color: '#93c5fd',
    }).setOrigin(0.5).setDepth(41).setAlpha(0).setShadow(0, 1, '#000000', 0.85, false, true)
    this.tweens.add({ targets: stats, alpha: 1, duration: 350, delay: 1040 })

    const restart = this.add.text(W / 2, H / 2 + 124, 'Press R to play again', {
      fontFamily: 'system-ui', fontSize: '18px', color: '#94a3b8',
    }).setOrigin(0.5).setDepth(41).setAlpha(0).setShadow(0, 1, '#000000', 0.85, false, true)
    this.tweens.add({ targets: restart, alpha: 1, duration: 400, delay: 1200 })

    sfx(520, 1040, 0.24, 0.06, 'triangle')
  }

  clearPowerupEffects() {
    this.fireballActive = false
    this.zeusActive = false
    this.athenaActive = false
    this.hermesActive = false
    if (this.fireballTimer) this.fireballTimer.remove(false)
    if (this.zeusTimer) this.zeusTimer.remove(false)
    if (this.athenaTimer) this.athenaTimer.remove(false)
    if (this.hermesTimer) this.hermesTimer.remove(false)
    this.brickCollider.active = true
    this.brickOverlap.active = false
    this.currentPaddleWidth = this.basePaddleWidth
    this.paddle.setDisplaySize(this.basePaddleWidth, 20)
    this.paddle.body.setSize(this.basePaddleWidth, 20)
    this.balls.getChildren().forEach((b) => {
      if (b.active) b.clearTint()
    })
    this.updatePowerupStatus()
  }

  saveState() {
    this.registry.set('score', this.score)
    this.registry.set('lives', this.lives)
  }

  loseLife() {
    if (this.gameEnded) return
    this.lives -= 1
    this.isRoundActive = false
    this.combo = 0
    this.comboExpireAt = 0
    this.updateComboDisplay()
    this.balls.clear(true, true)
    this.clearPowerupEffects()
    sfx(260, 80, 0.2, 0.06, 'sawtooth')
    this.cameras.main.shake(100, 0.005)

    this.heartsText.setText(this.getHeartsString())
    if (this.score > getHiScore()) setHiScore(this.score)
    this.hiScoreText.setText(`Best: ${getHiScore()}`)

    if (this.lives <= 0) {
      this.gameEnded = true
      this.showGameOverScreen()
      return
    }
    this.spawnBall(true)
    this.infoText.setText('Ball Lost!\nPress SPACE or Click').setVisible(true)
  }

  // ── TRAIL ────────────────────────────────────
  drawTrail() {
    this.trailGfx.clear()
    this.balls.getChildren().forEach((ball) => {
      if (!ball.active || ball.getData('stuck')) return
      const trail = ball.getData('trail') || []
      trail.push({ x: ball.x, y: ball.y })
      if (trail.length > 10) trail.shift()
      ball.setData('trail', trail)
      const color = this.fireballActive ? C.neonOrange : this.hermesActive ? C.gold : C.neonCyan
      trail.forEach((pos, i) => {
        const alpha = (i / trail.length) * 0.28
        const radius = 7 * (i / trail.length) * 0.7
        this.trailGfx.fillStyle(color, alpha)
        this.trailGfx.fillCircle(pos.x, pos.y, Math.max(1, radius))
        if (i > 0) {
          const prev = trail[i - 1]
          this.trailGfx.lineStyle(Math.max(1, radius * 0.5), color, alpha * 0.8)
          this.trailGfx.lineBetween(prev.x, prev.y, pos.x, pos.y)
        }
      })

      this.trailGfx.fillStyle(C.white, 0.24)
      this.trailGfx.fillCircle(ball.x, ball.y, 2)
    })
  }

  showGameOverScreen() {
    addEndScreenBackdrop(this, { templeIdx: this.templeIdx, accent: this.temple.accent, mood: 'defeat', depth: 39 })
    const overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0).setDepth(40)
    this.tweens.add({ targets: overlay, fillAlpha: 0.7, duration: 600 })

    const title = this.add.text(W / 2, H / 2 - 40, 'GAME OVER', {
      fontFamily: 'Cinzel, serif', fontSize: '48px', color: '#ef4444',
      stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(41).setAlpha(0).setScale(2)
    this.tweens.add({
      targets: title, alpha: 1, scaleX: 1, scaleY: 1,
      duration: 500, ease: 'Back.easeOut',
    })

    const scoreStr = `Score: ${this.score}` + (this.score >= getHiScore() ? '  ★ NEW BEST!' : `  |  Best: ${getHiScore()}`)
    const scoreText = this.add.text(W / 2, H / 2 + 20, scoreStr, {
      fontFamily: 'system-ui', fontSize: '22px', color: '#e2e8f0',
    }).setOrigin(0.5).setDepth(41).setAlpha(0).setShadow(0, 2, '#000000', 0.9, false, true)
    this.tweens.add({ targets: scoreText, alpha: 1, duration: 400, delay: 500 })

    const restart = this.add.text(W / 2, H / 2 + 65, 'Press R to try again', {
      fontFamily: 'system-ui', fontSize: '18px', color: '#94a3b8',
    }).setOrigin(0.5).setDepth(41).setAlpha(0).setShadow(0, 1, '#000000', 0.85, false, true)
    this.tweens.add({
      targets: restart, alpha: { from: 0, to: 1 }, duration: 400, delay: 800,
      onComplete: () => {
        this.tweens.add({ targets: restart, alpha: { from: 1, to: 0.3 }, duration: 800, yoyo: true, repeat: -1 })
      },
    })
  }

  // ── UPDATE ───────────────────────────────────
  update(_, delta) {
    advanceTempleParallax(this, delta)

    if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
      this.registry.set('score', 0)
      this.registry.set('lives', 3)
      this.registry.set('templeIdx', 0)
      this.registry.set('levelIdx', 0)
      this.scene.start('MenuScene')
      return
    }

    // Pause toggle
    if (Phaser.Input.Keyboard.JustDown(this.keyP) && !this.gameEnded) {
      this.paused = !this.paused
      if (this.paused) {
        this.physics.pause()
        this.pauseOverlay.setVisible(true)
        this.pausePanel.setVisible(true)
        this.pausePanelGlow.setVisible(true)
        this.pauseText.setVisible(true)
        this.pauseSub.setVisible(true)
      } else {
        this.physics.resume()
        this.pauseOverlay.setVisible(false)
        this.pausePanel.setVisible(false)
        this.pausePanelGlow.setVisible(false)
        this.pauseText.setVisible(false)
        this.pauseSub.setVisible(false)
      }
      return
    }
    if (this.paused) return

    if (this.combo > 0 && this.time.now > this.comboExpireAt) {
      this.combo = 0
      this.updateComboDisplay()
    } else if (this.combo > 0) {
      const remaining = Math.max(0, this.comboExpireAt - this.time.now)
      const pct = Phaser.Math.Clamp(remaining / this.comboWindowMs, 0, 1)
      this.comboGaugeFill.width = Math.max(4, 200 * pct)
    }

    if (!this.gameEnded) {
      const speed = this.hermesActive ? 740 : 540
      if (this.cursors.left.isDown) this.paddle.setVelocityX(-speed)
      else if (this.cursors.right.isDown) this.paddle.setVelocityX(speed)
      else this.paddle.setVelocityX(0)

      this.paddle.x = Phaser.Math.Clamp(
        this.paddle.x,
        this.currentPaddleWidth / 2 + 12,
        W - this.currentPaddleWidth / 2 - 12
      )
      this.paddle.y = PADDLE_Y

      if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
        this.launchBall()
      }
    }

    this.balls.getChildren().forEach((ball) => {
      if (!ball.active) return
      if (ball.getData('stuck')) {
        ball.x = this.paddle.x
        ball.y = this.paddle.y - 22
      } else {
        this.preventPaddlePassThrough(ball)

        // Enforce minimum vertical speed so ball never goes fully horizontal
        const minVy = this.stageBallSpeed * 0.3
        if (Math.abs(ball.body.velocity.y) < minVy) {
          const spd = ball.body.velocity.length()
          const sign = ball.body.velocity.y >= 0 ? 1 : -1
          ball.body.velocity.y = sign * minVy
          // Preserve total speed
          const remainX = Math.sqrt(Math.max(0, spd * spd - minVy * minVy))
          ball.body.velocity.x = (ball.body.velocity.x >= 0 ? 1 : -1) * remainX
        }
        if (ball.y > H + 20) {
          ball.destroy()
        }
      }

      ball.setData('prevY', ball.y)
    })

    this.powerups.getChildren().forEach((pw) => {
      if (pw.active && pw.y > H + 30) pw.destroy()
    })

    if (!this.gameEnded && this.isRoundActive && this.balls.countActive(true) === 0) {
      this.loseLife()
    }

    this.drawTrail()
    this.drawTimerBars()
  }
}

// ══════════ UPGRADE SCENE ════════════════════════
class UpgradeScene extends Phaser.Scene {
  constructor() {
    super('UpgradeScene')
  }

  preload() {
    preloadTempleParallax(this)
  }

  create() {
    this.cameras.main.setBackgroundColor(C.bg)
    playBgm('upgrade')
    this.cameras.main.fadeIn(400)

    const nextTemple = TEMPLES[this.registry.get('templeIdx')]
    const nextTempleIdx = this.registry.get('templeIdx')

    createTempleAtmosphere(this, {
      templeIdx: nextTempleIdx,
      accent: nextTemple.accent,
      bgColor: nextTemple.bg,
      depth: -4,
      sigilY: 126,
      sigilScale: 0.92,
      columns: true,
      vignette: true,
    })

    const frame = this.add.rectangle(W / 2, H / 2, W - 40, H - 48, 0x020617, 0.42)
      .setStrokeStyle(1, nextTemple.accent, 0.35)
    const frameTop = this.add.rectangle(W / 2, 32, W - 60, 2, nextTemple.accent, 0.72)
    frame.setDepth(0)
    frameTop.setDepth(0)

    for (let i = 0; i < 18; i++) {
      const mote = this.add.circle(
        Phaser.Math.Between(60, W - 60),
        Phaser.Math.Between(90, H - 70),
        Phaser.Math.FloatBetween(1, 2.4),
        Phaser.Math.Between(0, 1) ? nextTemple.accent : C.neonCyan,
        Phaser.Math.FloatBetween(0.06, 0.16)
      )
      mote.setDepth(0)
      this.tweens.add({
        targets: mote,
        y: mote.y + Phaser.Math.Between(-24, 24),
        x: mote.x + Phaser.Math.Between(-24, 24),
        alpha: { from: mote.alpha, to: Phaser.Math.FloatBetween(0.02, 0.11) },
        duration: Phaser.Math.Between(2200, 4200),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })
    }

    this.add
      .text(W / 2, 60, 'Choose a Divine Blessing', {
        fontFamily: 'Cinzel, serif',
        fontSize: '38px',
        color: '#fbbf24',
      })
      .setOrigin(0.5)
      .setShadow(0, 2, '#000000', 0.8, false, true)

    this.add
      .text(W / 2, 110, `Next: ${nextTemple.name}`, {
        fontFamily: 'system-ui',
        fontSize: '20px',
        color: '#94a3b8',
      })
      .setOrigin(0.5)
      .setShadow(0, 1, '#000000', 0.8, false, true)

    this.add
      .text(W / 2, 140, TEMPLE_LORE[this.registry.get('templeIdx')] || '', {
        fontFamily: 'system-ui',
        fontSize: '15px',
        color: '#cbd5e1',
        align: 'center',
        wordWrap: { width: 760 },
      })
      .setOrigin(0.5)
      .setShadow(0, 1, '#000000', 0.82, false, true)

    const shuffled = Phaser.Utils.Array.Shuffle([...UPGRADE_POOL])
    const choices = shuffled.slice(0, 3)

    choices.forEach((upgrade, i) => {
      const x = W / 2 - 230 + i * 230
      const y = H / 2 + 20

      const card = this.add
        .rectangle(x, y, 200, 250, 0x1e293b, 0.9)
        .setStrokeStyle(2, C.gold, 0.35)
        .setInteractive({ useHandCursor: true })
      card.setDepth(2)

      const cardGlow = this.add.rectangle(x, y, 206, 256, nextTemple.accent, 0.08)
        .setDepth(1)
        .setVisible(false)

      const icon = this.add
        .text(x, y - 75, upgrade.icon, { fontSize: '44px' })
        .setOrigin(0.5)
        .setDepth(3)

      const name = this.add
        .text(x, y - 20, upgrade.name, {
          fontFamily: 'Cinzel, serif',
          fontSize: '17px',
          color: '#e2e8f0',
          align: 'center',
          wordWrap: { width: 170 },
        })
        .setOrigin(0.5)
        .setShadow(0, 1, '#000000', 0.7, false, true)
        .setDepth(3)

      const desc = this.add
        .text(x, y + 30, upgrade.desc, {
          fontFamily: 'system-ui',
          fontSize: '15px',
          color: '#94a3b8',
          align: 'center',
        })
        .setOrigin(0.5)
        .setShadow(0, 1, '#000000', 0.72, false, true)
        .setDepth(3)

      ;[card, cardGlow, icon, name, desc].forEach((obj) => {
        obj.setAlpha(0)
        obj.y += 18
        this.tweens.add({
          targets: obj,
          alpha: 1,
          y: obj.y - 18,
          duration: 260,
          delay: 120 + i * 110,
          ease: 'Quad.easeOut',
        })
      })

      card.on('pointerover', () => {
        card.setStrokeStyle(3, C.gold, 1)
        cardGlow.setVisible(true)
      })
      card.on('pointerout', () => {
        card.setStrokeStyle(2, C.gold, 0.35)
        cardGlow.setVisible(false)
      })
      card.on('pointerdown', () => {
        const current = this.registry.get(upgrade.key) ?? 0
        this.registry.set(upgrade.key, current + upgrade.delta)
        sfx(500, 800, 0.12, 0.05, 'triangle')
        this.cameras.main.fadeOut(400)
        this.time.delayedCall(400, () => this.scene.start('GameScene'))
      })
    })

    // Show current stats
    const r = this.registry
    this.add
      .text(W / 2, H - 50, `Score: ${r.get('score')}  |  Lives: ${r.get('lives')}`, {
        fontFamily: 'system-ui',
        fontSize: '16px',
        color: '#64748b',
      })
      .setOrigin(0.5)
      .setShadow(0, 1, '#000000', 0.78, false, true)
  }

  update(_, delta) {
    advanceTempleParallax(this, delta)
  }
}

// ══════════ GAME CONFIG ══════════════════════════
new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: W,
  height: H,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: W,
    height: H,
  },
  backgroundColor: '#0a0e27',
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [MenuScene, GameScene, UpgradeScene],
})
