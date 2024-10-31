'use client'

interface PaletteDisplayProps {
  colors: string[]
}

export function PaletteDisplay({ colors }: PaletteDisplayProps) {
  const copyToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value)
  }

  const formatOklch = (color: string) => {
    const match = color.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/)
    if (match) {
      const precision = 3
      const [_, l, c, h] = match
      return `oklch(${Number(l).toFixed(precision)} ${Number(c).toFixed(precision)} ${Number(h).toFixed(precision)})`
    }
    return color
  }

  const getRgbAndHex = (color: string) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return { rgb: '', hex: '' }

    ctx.fillStyle = color
    const rgbStr = ctx.fillStyle
    
    const hex = rgbStr.startsWith('#') ? rgbStr.toUpperCase() : '#' + rgbStr.slice(4, -1).split(',').map(x => 
      parseInt(x).toString(16).padStart(2, '0')
    ).join('').toUpperCase()
    
    const rgbValues = hex.slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16))
    const rgb = rgbValues ? `rgb(${rgbValues.join(', ')})` : ''

    return { rgb, hex }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {colors.map((color, index) => {
        const formattedOklch = formatOklch(color)
        const { rgb, hex } = getRgbAndHex(color)
        
        return (
          <div
            key={index}
            className="h-auto aspect-video rounded-md relative p-3 flex flex-col justify-between gap-2"
            style={{ backgroundColor: color }}
          >
            <button
              onClick={() => copyToClipboard(formattedOklch)}
              className="bg-background/90 text-foreground px-3 py-2 rounded text-xs font-mono text-left hover:bg-background/95 transition-colors"
            >
              {formattedOklch}
            </button>
            <button
              onClick={() => copyToClipboard(hex)}
              className="bg-background/90 text-foreground px-3 py-2 rounded text-xs font-mono text-left hover:bg-background/95 transition-colors"
            >
              {hex}
            </button>
            <button
              onClick={() => copyToClipboard(rgb)}
              className="bg-background/90 text-foreground px-3 py-2 rounded text-xs font-mono text-left hover:bg-background/95 transition-colors"
            >
              {rgb}
            </button>
          </div>
        )
      })}
    </div>
  )
} 