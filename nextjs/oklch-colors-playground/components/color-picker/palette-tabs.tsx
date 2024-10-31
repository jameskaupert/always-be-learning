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
        <PaletteDisplay colors={lightnessPalette} />
      </TabsContent>
      <TabsContent value="hue">
        <PaletteDisplay colors={huePalette} />
      </TabsContent>
      <TabsContent value="wheel">
        <PaletteDisplay colors={hueLightnessPalette} />
      </TabsContent>
    </Tabs>
  )
} 