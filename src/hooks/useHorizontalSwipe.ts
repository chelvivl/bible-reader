import { useRef, type TouchEvent } from 'react'

interface SwipeHandlers {
  onPrev: () => void
  onNext: () => void
  enabledPrev: boolean
  enabledNext: boolean
}

export function useHorizontalSwipe({ onPrev, onNext, enabledPrev, enabledNext }: SwipeHandlers) {
  const start = useRef({ x: 0, y: 0 })

  return {
    onTouchStart: (event: TouchEvent) => {
      start.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      }
    },
    onTouchEnd: (event: TouchEvent) => {
      const dx = event.changedTouches[0].clientX - start.current.x
      const dy = event.changedTouches[0].clientY - start.current.y
      if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.2) return
      if (dx < 0 && enabledNext) onNext()
      if (dx > 0 && enabledPrev) onPrev()
    },
  }
}
