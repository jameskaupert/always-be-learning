export const BASE_COLOR = 'oklch(50% 0.08 302)'

export function getTextColor(color: string): string {
  const match = color.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\)/)
  if (match) {
    const [_, l] = match
    return Number(l) > 60 ? 'oklch(20% 0.02 302)' : 'oklch(95% 0.02 302)'
  }
  return 'currentColor'
} 