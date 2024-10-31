'use client'

interface PaletteDisplayProps {
  colors: string[]
}

export function PaletteDisplay({ colors }: PaletteDisplayProps) {
  console.log('Rendering PaletteDisplay with colors:', colors)

  const copyToClipboard = async (color: string) => {
    await navigator.clipboard.writeText(color)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {colors.map((color, index) => (
        <button
          key={index}
          onClick={() => copyToClipboard(color)}
          className="h-24 rounded-md relative group transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring"
          style={{ backgroundColor: color }}
        >
          <span className="absolute bottom-2 left-2 text-xs font-mono 
            opacity-0 group-hover:opacity-100 transition-opacity
            bg-background/80 text-foreground px-2 py-1 rounded">
            {color}
          </span>
        </button>
      ))}
    </div>
  )
} 