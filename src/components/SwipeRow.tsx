import { useRef, useState, type ReactNode, type TouchEvent } from 'react'

const ACTION_WIDTH = 92

interface SwipeRowProps {
  children: ReactNode
  actionLabel: string
  onAction: () => void
}

export function SwipeRow({ children, actionLabel, onAction }: SwipeRowProps) {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const start = useRef({ x: 0, y: 0, base: 0 })
  const axis = useRef<'none' | 'x' | 'y'>('none')

  const handleTouchStart = (event: TouchEvent) => {
    start.current = { x: event.touches[0].clientX, y: event.touches[0].clientY, base: offset }
    axis.current = 'none'
    setDragging(true)
  }

  const handleTouchMove = (event: TouchEvent) => {
    const dx = event.touches[0].clientX - start.current.x
    const dy = event.touches[0].clientY - start.current.y

    if (axis.current === 'none') {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
      axis.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
    }

    if (axis.current !== 'x') return

    const next = Math.min(0, Math.max(-ACTION_WIDTH - 24, start.current.base + dx))
    setOffset(next)
  }

  const handleTouchEnd = () => {
    setDragging(false)
    if (axis.current !== 'x') return
    setOffset(offset < -ACTION_WIDTH / 2 ? -ACTION_WIDTH : 0)
  }

  return (
    <div className="swipe-row">
      <button
        type="button"
        className="swipe-row__action"
        style={{ width: ACTION_WIDTH }}
        onClick={() => {
          setOffset(0)
          onAction()
        }}
      >
        {actionLabel}
      </button>
      <div
        className={`swipe-row__content${dragging ? ' is-dragging' : ''}`}
        style={{ transform: `translate3d(${offset}px, 0, 0)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}
