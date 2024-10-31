'use client'

import { useState, useEffect } from 'react'
import { ColorInput } from '@/components/color-picker/color-input'
import { PaletteDisplay } from '@/components/color-picker/palette-display'
import { 
  generateLightnessPalette, 
  generateHuePalette,
  generateHueLightnessPalette 
} from '@/lib/color-utils'

const baseColor = 'oklch(50% 0.08 320)'

export default function Home() {
  const [colorCount, setColorCount] = useState(16)
  const [currentColor, setCurrentColor] = useState(baseColor)
  const [lightnessPalette, setLightnessPalette] = useState<string[]>([])
  const [huePalette, setHuePalette] = useState<string[]>([])
  const [hueLightnessPalette, setHueLightnessPalette] = useState<string[]>([])

  const updatePalettes = (color: string, count: number) => {
    setLightnessPalette(generateLightnessPalette(color, count))
    setHuePalette(generateHuePalette(color, count))
    setHueLightnessPalette(generateHueLightnessPalette(color, count))
  }

  // Initial setup
  useEffect(() => {
    updatePalettes(currentColor, colorCount)
  }, [])

  // Handle color count changes
  useEffect(() => {
    updatePalettes(currentColor, colorCount)
  }, [colorCount])

  const handleColorChange = (color: string) => {
    setCurrentColor(color)
    updatePalettes(color, colorCount)
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        OKLCH Color Palette Generator
      </h1>
      <div className="space-y-8">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <ColorInput 
              onColorChange={handleColorChange}
              initialColor={currentColor}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="colorCount" className="block text-sm font-medium">
              Colors per palette
            </label>
            <input
              id="colorCount"
              type="number"
              min="2"
              max="32"
              value={colorCount}
              onChange={(e) => setColorCount(Math.max(2, Math.min(32, Number(e.target.value))))}
              className="w-20 px-3 py-2 rounded-md border border-border"
            />
          </div>
        </div>
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Lightness Variations</h2>
            <PaletteDisplay colors={lightnessPalette} />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">Hue Variations</h2>
            <PaletteDisplay colors={huePalette} />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">Balanced Hue-Lightness Wheel</h2>
            <PaletteDisplay colors={hueLightnessPalette} />
          </section>
        </div>
      </div>
    </main>
  )
}
