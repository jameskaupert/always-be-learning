'use client'

import { useState, useEffect } from 'react'
import { ColorInput } from '@/components/color-picker/color-input'
import { PaletteDisplay } from '@/components/color-picker/palette-display'
import { 
  generateLightnessPalette, 
  generateHuePalette,
  generateHueLightnessPalette 
} from '@/lib/color-utils'

export default function Home() {
  const [lightnessPalette, setLightnessPalette] = useState<string[]>([])
  const [huePalette, setHuePalette] = useState<string[]>([])
  const [hueLightnessPalette, setHueLightnessPalette] = useState<string[]>([])

  useEffect(() => {
    const initialColor = 'oklch(50% 0.08 320)'
    setLightnessPalette(generateLightnessPalette(initialColor))
    setHuePalette(generateHuePalette(initialColor))
    setHueLightnessPalette(generateHueLightnessPalette(initialColor))
  }, [])

  const handleColorChange = (color: string) => {
    setLightnessPalette(generateLightnessPalette(color))
    setHuePalette(generateHuePalette(color))
    setHueLightnessPalette(generateHueLightnessPalette(color))
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        OKLCH Color Palette Generator
      </h1>
      <div className="space-y-8">
        <ColorInput onColorChange={handleColorChange} />
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
