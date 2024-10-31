'use client'

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface PaletteDisplayProps {
  colors: string[]
}

export function PaletteDisplay({ colors }: PaletteDisplayProps) {
  const { toast } = useToast()

  const copyToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value)
    toast({
      description: "Color value copied to clipboard",
      duration: 2000,
    })
  }

  const formatOklch = (color: string) => {
    const match = color.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/)
    if (match) {
      const [_, l, c, h] = match
      return `oklch(${Number(l).toFixed(2)} ${Number(c).toFixed(2)} ${Number(h).toFixed(2)})`
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
            <Button
              variant="secondary"
              onClick={() => copyToClipboard(formattedOklch)}
              className="h-auto py-2 px-3 font-mono text-xs text-center bg-background/90 hover:bg-background/95 w-full"
            >
              {formattedOklch}
            </Button>
            <Button
              variant="secondary"
              onClick={() => copyToClipboard(hex)}
              className="h-auto py-2 px-3 font-mono text-xs text-center bg-background/90 hover:bg-background/95 w-full"
            >
              {hex}
            </Button>
            <Button
              variant="secondary"
              onClick={() => copyToClipboard(rgb)}
              className="h-auto py-2 px-3 font-mono text-xs text-center bg-background/90 hover:bg-background/95 w-full"
            >
              {rgb}
            </Button>
          </div>
        )
      })}
    </div>
  )
} 