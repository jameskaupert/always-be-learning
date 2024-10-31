'use client'

import { useState, useEffect } from 'react'
import { ColorInput } from '@/components/color-picker/color-input'
import { PaletteTabs } from '@/components/color-picker/palette-tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  generateLightnessPalette, 
  generateHuePalette,
  generateHueLightnessPalette 
} from '@/lib/color-utils'
import { BASE_COLOR } from '@/lib/color-config'

const baseColor = BASE_COLOR

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

  useEffect(() => {
    updatePalettes(currentColor, colorCount)
  }, [])

  useEffect(() => {
    updatePalettes(currentColor, colorCount)
  }, [colorCount])

  const handleColorChange = (color: string) => {
    setCurrentColor(color)
    updatePalettes(color, colorCount)
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold" style={{ color: currentColor }}>
          OKLCH Color Palette Generator
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Base Color</CardTitle>
            <CardDescription>
              Adjust the lightness, chroma, and hue to set your base color for palette generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ColorInput 
              onColorChange={handleColorChange} 
              initialColor={currentColor} 
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Label htmlFor="colorCount" className="whitespace-nowrap">
            Colors per palette
          </Label>
          <Input
            id="colorCount"
            type="number"
            min="2"
            max="32"
            value={colorCount}
            onChange={(e) => setColorCount(Math.max(2, Math.min(32, Number(e.target.value))))}
            className="w-20"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Color Palettes</CardTitle>
            <CardDescription>
              Different variations of your base color
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaletteTabs
              lightnessPalette={lightnessPalette}
              huePalette={huePalette}
              hueLightnessPalette={hueLightnessPalette}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
