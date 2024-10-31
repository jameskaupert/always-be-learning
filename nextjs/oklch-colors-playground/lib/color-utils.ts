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

export function generateLightnessPalette(baseColor: string): string[] {
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
      c: Math.max(0, Math.min(0.4, color.c)),
      h: color.h
    })
    return formatCss(newColor)
  })
}

export function generateHuePalette(baseColor: string): string[] {
  const color = oklch(baseColor) as OklchColor | null
  if (!color) {
    console.warn(`Invalid color: ${baseColor}`)
    return []
  }

  return Array.from({ length: 16 }, (_, i) => {
    const hue = (color.h + (i * 22.5)) % 360 // 360/16 = 22.5 degrees per step
    const newColor = oklch({
      mode: 'oklch',
      l: color.l,
      c: Math.max(0, Math.min(0.4, color.c)),
      h: hue
    })
    return formatCss(newColor)
  })
}

export function generateHueLightnessPalette(baseColor: string): string[] {
  const color = oklch(baseColor) as OklchColor | null
  if (!color) {
    console.warn(`Invalid color: ${baseColor}`)
    return []
  }

  return Array.from({ length: 16 }, (_, i) => {
    const hue = (color.h + (i * 22.5)) % 360 // 360/16 = 22.5 degrees per step
    
    // Adjust the phase and amplitude of the sine wave
    // Center around yellow (80°) and blue (270°)
    const hueRad = (hue - 80) * (Math.PI / 180)
    // Base lightness of 0.65 with ±0.1 variation (smaller range)
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