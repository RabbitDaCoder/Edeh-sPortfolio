import { ChevronRight } from 'lucide-react'

interface ChevronLogoProps {
  size?: number
  color?: string
  className?: string
}

export function ChevronLogo({
  size = 32,
  color = 'currentColor',
  className = '',
}: ChevronLogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-md bg-text-primary p-1 ${className}`}
      style={{ width: size, height: size }}
      aria-label="RabbitDaCoder logo"
      role="img"
    >
      <ChevronRight
        size={size * 0.65}
        strokeWidth={2.5}
        color={color === 'currentColor' ? '#F5F5F5' : color}
      />
    </div>
  )
}
