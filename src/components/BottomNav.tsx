import { BookIcon, CalendarIcon } from './icons'

type Tab = 'read' | 'plans'

interface BottomNavProps {
  activeTab: Tab
  onChange: (tab: Tab) => void
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      <button
        type="button"
        className={`nav-item${activeTab === 'read' ? ' nav-item--active' : ''}`}
        onClick={() => onChange('read')}
      >
        <BookIcon />
        <span>Чтение</span>
      </button>
      <button
        type="button"
        className={`nav-item${activeTab === 'plans' ? ' nav-item--active' : ''}`}
        onClick={() => onChange('plans')}
      >
        <CalendarIcon />
        <span>Планы</span>
      </button>
    </nav>
  )
}
