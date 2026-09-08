interface ProgressBarProps {
  value: number
  label?: string
  size?: 'sm' | 'md'
}

export function ProgressBar({ value, label, size = 'md' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={`progress${size === 'sm' ? ' progress--sm' : ''}`}>
      {label && (
        <div className="progress__label">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className="progress__track" aria-hidden="true">
        <div className="progress__fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}
