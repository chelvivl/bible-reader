import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { usePresence } from '../hooks/usePresence'
import { CloseIcon } from './icons'

interface BottomSheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function BottomSheet({ open, title, onClose, children }: BottomSheetProps) {
  const { mounted, visible } = usePresence(open, 340)

  useEffect(() => {
    if (!mounted) return undefined
    document.body.classList.add('sheet-open')
    return () => {
      document.body.classList.remove('sheet-open')
    }
  }, [mounted])

  if (!mounted) return null

  return createPortal(
    <div className={`sheet-root${visible ? ' is-open' : ''}`} role="presentation">
      <button type="button" className="sheet-backdrop" aria-label="Закрыть" onClick={onClose} />
      <div className="sheet-panel" role="dialog" aria-modal="true" aria-label={title}>
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-header">
          <h2 className="sheet-title">{title}</h2>
          <button type="button" className="icon-button" aria-label="Закрыть" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
