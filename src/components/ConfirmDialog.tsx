import { createPortal } from 'react-dom'
import { usePresence } from '../hooks/usePresence'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Удалить',
  cancelLabel = 'Отмена',
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { mounted, visible } = usePresence(open, 240)

  if (!mounted) return null

  return createPortal(
    <div className={`alert-root${visible ? ' is-open' : ''}`}>
      <button type="button" className="alert-scrim" aria-label={cancelLabel} onClick={onCancel} />
      <div className="alert" role="alertdialog" aria-modal="true" aria-label={title}>
        <div className="alert__content">
          <h2 className="alert__title">{title}</h2>
          {message && <p className="alert__message">{message}</p>}
        </div>
        <div className="alert__actions">
          <button type="button" className="alert__button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`alert__button${destructive ? ' alert__button--destructive' : ''}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
