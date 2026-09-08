import type { ReactNode } from 'react'
import { CloseIcon } from './icons'

interface BottomSheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function BottomSheet({ open, title, onClose, children }: BottomSheetProps) {
  if (!open) return null

  return (
    <div className="sheet-root" role="presentation">
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
    </div>
  )
}
