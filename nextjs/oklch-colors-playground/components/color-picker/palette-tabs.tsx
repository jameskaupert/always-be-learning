'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaletteDisplay } from "./palette-display"

interface PaletteTabsProps {
  lightnessPalette: string[]
  huePalette: string[]
  hueLightnessPalette: string[]
}

export function PaletteTabs({ lightnessPalette, huePalette, hueLightnessPalette }: PaletteTabsProps) {
  return (
    <Tabs defaultValue="lightness" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="lightness">Lightness</TabsTrigger>
        <TabsTrigger value="hue">Hue</TabsTrigger>
        <TabsTrigger value="wheel">Hue-Lightness</TabsTrigger>
      </TabsList>
      <TabsContent value="lightness">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Variations of the base color with different lightness values, maintaining the same hue and chroma.
          </p>
          <PaletteDisplay colors={lightnessPalette} />
        </div>
      </TabsContent>
      <TabsContent value="hue">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Colors distributed around the color wheel with consistent lightness and chroma.
          </p>
          <PaletteDisplay colors={huePalette} />
        </div>
      </TabsContent>
      <TabsContent value="wheel">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Colors distributed around the color wheel maintaining constant chroma with lightness adjusted to maintain perceived brightness. Yellow is the lightest.
          </p>
          <p className="text-sm text-muted-foreground">
            The base color may not appear exactly in this palette due to lightness adjustments.
          </p>
          <PaletteDisplay colors={hueLightnessPalette} />
        </div>
      </TabsContent>
    </Tabs>
  )
} 