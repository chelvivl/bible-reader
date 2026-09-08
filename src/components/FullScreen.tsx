import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { usePresence } from '../hooks/usePresence'

interface FullScreenProps {
  open: boolean
  title: string
  onClose: () => void
  closeLabel?: string
  children: ReactNode
  footer?: ReactNode
}

export function FullScreen({
  open,
  title,
  onClose,
  closeLabel = 'Закрыть',
  children,
  footer,
}: FullScreenProps) {
  const { mounted, visible } = usePresence(open, 360)

  useEffect(() => {
    if (!mounted) return undefined
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [mounted])

  if (!mounted) return null

  return createPortal(
    <div className={`full-screen${visible ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
      <header className="full-screen__bar">
        <button type="button" className="nav-text" onClick={onClose}>
          {closeLabel}
        </button>
        <h1 className="full-screen__title">{title}</h1>
        <span className="full-screen__spacer" />
      </header>
      <div className="full-screen__body">{children}</div>
      {footer && <div className="full-screen__footer">{footer}</div>}
    </div>,
    document.body,
  )
}
