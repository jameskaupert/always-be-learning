import { useMode, modeOklch, formatCss } from 'culori/fn'

// Define the OklchColor interface
interface OklchColor {
  mode: 'oklch'
  l: number
  c: number
  h: number
}

// Initialize the oklch color space
const oklch = useMode(modeOklch)

export function generatePalette(baseColor: string): string[] {
  const color = oklch(baseColor) as OklchColor | null
  if (!color) {
    console.warn(`Invalid color: ${baseColor}`)
    return []
  }

  return Array.from({ length: 9 }, (_, i) => {
    const lightness = Math.max(0.1, Math.min(0.95 - (i * 0.1), 0.95))
    const newColor = oklch({
      mode: 'oklch',
      l: lightness,
      c: Math.max(0, Math.min(0.4, color.c)), // Limit chroma to valid range
      h: color.h
    })
    return formatCss(newColor)
  })
}

export function generateLightnessPalette(baseColor: string, count: number = 16): string[] {
  const color = oklch(baseColor) as OklchColor | null
  if (!color) {
    console.warn(`Invalid color: ${baseColor}`)
    return []
  }

  return Array.from({ length: count }, (_, i) => {
    const lightness = Math.max(0.1, Math.min(0.95 - (i * (0.85 / (count - 1))), 0.95))
    const newColor = oklch({
      mode: 'oklch',
      l: lightness,
      c: Math.max(0, Math.min(0.4, color.c)),
      h: color.h
    })
    return formatCss(newColor)
  })
}

export function generateHuePalette(baseColor: string, count: number = 16): string[] {
  const color = oklch(baseColor) as OklchColor | null
  if (!color) {
    console.warn(`Invalid color: ${baseColor}`)
    return []
  }

  return Array.from({ length: count }, (_, i) => {
    const hue = (color.h + (i * (360 / count))) % 360
    const newColor = oklch({
      mode: 'oklch',
      l: color.l,
      c: Math.max(0, Math.min(0.4, color.c)),
      h: hue
    })
    return formatCss(newColor)
  })
}

export function generateHueLightnessPalette(baseColor: string, count: number = 16): string[] {
  const color = oklch(baseColor) as OklchColor | null
  if (!color) {
    console.warn(`Invalid color: ${baseColor}`)
    return []
  }

  return Array.from({ length: count }, (_, i) => {
    const hue = (color.h + (i * (360 / count))) % 360
    const hueRad = (hue - 85) * (Math.PI / 180)
    const lightness = 0.65 + (0.1 * Math.sin(hueRad))
    
    const newColor = oklch({
      mode: 'oklch',
      l: lightness,
      c: Math.max(0, Math.min(0.4, color.c)),
      h: hue
    })
    return formatCss(newColor)
  })
}

export function isValidOklch(color: string): boolean {
  try {
    return !!oklch(color)
  } catch {
    return false
  }
} 