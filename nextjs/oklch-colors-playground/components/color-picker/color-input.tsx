'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { isValidOklch } from '@/lib/color-utils'
import { getTextColor } from '@/lib/color-config'
import { BASE_COLOR } from '@/lib/color-config'
import { cn } from '@/lib/utils'

interface ColorInputProps {
  onColorChange: (color: string) => void
  initialColor?: string
}

interface OklchComponents {
  lightness: number
  chroma: number
  hue: number
}

function parseOklch(color: string): OklchComponents {
  const match = color.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\)/)
  if (match) {
    const [_, l, c, h] = match
    return {
      lightness: Number(l),
      chroma: Number(c),
      hue: Number(h)
    }
  }
  return parseOklch(BASE_COLOR)
}

export function ColorInput({ onColorChange, initialColor = BASE_COLOR }: ColorInputProps) {
  const [components, setComponents] = useState<OklchComponents>(parseOklch(initialColor))

  const constructOklchString = (comps: OklchComponents) => {
    return `oklch(${comps.lightness.toFixed(2)}% ${comps.chroma.toFixed(3)} ${comps.hue.toFixed(1)})`
  }

  const handleComponentChange = (key: keyof OklchComponents, value: number | number[]) => {
    const numericValue = Array.isArray(value) ? value[0] : value
    const newComponents = {
      ...components,
      [key]: numericValue
    }
    setComponents(newComponents)
    const colorString = constructOklchString(newComponents)
    if (isValidOklch(colorString)) {
      onColorChange(colorString)
    }
  }

  const colorString = constructOklchString(components)
  const isValid = isValidOklch(colorString)
  const textColor = getTextColor(colorString)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-4">
          {['lightness', 'chroma', 'hue'].map((param) => (
            <div key={param} className="space-y-2">
              <div className="flex justify-between">
                <Label 
                  htmlFor={param}
                >
                  {param.charAt(0).toUpperCase() + param.slice(1)}
                </Label>
                <span 
                  className="text-sm text-muted-foreground"
                >
                  {param === 'lightness' && `${components[param].toFixed(2)}%`}
                  {param === 'chroma' && components[param].toFixed(3)}
                  {param === 'hue' && `${components[param].toFixed(1)}°`}
                </span>
              </div>
              <Slider
                id={param}
                min={param === 'lightness' ? 0 : param === 'chroma' ? 0 : 0}
                max={param === 'lightness' ? 100 : param === 'chroma' ? 0.4 : 360}
                step={param === 'lightness' ? 0.01 : param === 'chroma' ? 0.001 : 0.5}
                value={[components[param as keyof OklchComponents]]}
                onValueChange={(value) => handleComponentChange(param as keyof OklchComponents, value)}
                className={cn(
                  "[&_.bg-primary]:bg-current",
                  "[&_[data-orientation=horizontal]>.bg-primary]:bg-current",
                  "[&_.border-primary]:border-current"
                )}
                style={{ color: isValid ? colorString : undefined }}
              />
            </div>
          ))}
        </div>
      </div>

      <div 
        className="w-full h-20 rounded-md transition-colors relative flex items-center justify-center"
        style={{ backgroundColor: isValid ? colorString : '#ff0000' }}
      >
        <div 
          className="px-3 py-1.5 rounded-md bg-background/90 font-mono text-sm text-foreground"
        >
          {colorString}
        </div>
      </div>
    </div>
  )
} 