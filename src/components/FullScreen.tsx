import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { usePresence } from '../hooks/usePresence'
import { ChevronLeftIcon } from './icons'

interface FullScreenProps {
  open: boolean
  title: string
  onClose: () => void
  closeLabel?: string
  backLabel?: string
  onBack?: () => void
  children: ReactNode
  footer?: ReactNode
}

export function FullScreen({
  open,
  title,
  onClose,
  closeLabel = 'Готово',
  backLabel,
  onBack,
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
    <div
      className={`full-screen${visible ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <header className="nav-bar nav-bar--modal">
        {onBack ? (
          <button type="button" className="nav-text nav-text--back nav-bar__slot" onClick={onBack}>
            <ChevronLeftIcon />
            {backLabel}
          </button>
        ) : (
          <span className="nav-bar__slot" />
        )}
        <h2 className="nav-bar__title">{title}</h2>
        <button type="button" className="nav-text nav-text--strong nav-bar__slot" onClick={onClose}>
          {closeLabel}
        </button>
      </header>
      <div className="full-screen__body">{children}</div>
      {footer && <div className="full-screen__footer">{footer}</div>}
    </div>,
    document.body,
  )
}
