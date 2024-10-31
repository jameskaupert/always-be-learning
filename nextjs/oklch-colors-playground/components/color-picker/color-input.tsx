'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="color-input">OKLCH Color</Label>
        <Input
          id="color-input"
          type="text"
          value={value}
          onChange={handleChange}
          className={`font-mono ${!isValid && 'border-destructive focus-visible:ring-destructive'}`}
          placeholder="oklch(60% 0.15 270)"
        />
      </div>
      <div 
        className="w-full h-20 rounded-md transition-colors"
        style={{ backgroundColor: isValid ? value : '#ff0000' }}
      />
    </div>
  )
} 