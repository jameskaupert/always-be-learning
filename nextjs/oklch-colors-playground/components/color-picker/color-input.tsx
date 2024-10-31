'use client'

import { useState } from 'react'
import { isValidOklch } from '@/lib/color-utils'

interface ColorInputProps {
  onColorChange: (color: string) => void
  initialColor?: string
}

export function ColorInput({ onColorChange, initialColor = 'oklch(60% 0.15 270)' }: ColorInputProps) {
  const [value, setValue] = useState(initialColor)
  const [isValid, setIsValid] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    
    const valid = isValidOklch(newValue)
    setIsValid(valid)
    
    if (valid) {
      onColorChange(newValue)
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className={`w-full px-4 py-2 rounded-md border ${
          isValid ? 'border-border' : 'border-destructive'
        } font-mono text-sm`}
        placeholder="oklch(60% 0.15 270)"
      />
      <div 
        className="w-full h-20 rounded-md transition-colors"
        style={{ backgroundColor: isValid ? value : '#ff0000' }}
      />
    </div>
  )
} 