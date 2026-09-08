interface ProgressRingProps {
  value: number
  size?: number
}

export function ProgressRing({ value, size = 46 }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const stroke = size >= 60 ? 5 : 4
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          className="ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          className="ring__value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="ring__label" style={{ fontSize: size >= 60 ? 15 : 12 }}>
        {clamped}%
      </span>
    </div>
  )
}
