import { useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { PlansView } from './components/PlansView'
import { ReadingView } from './components/ReadingView'
import { useBible } from './hooks/useBible'
import { usePlans } from './hooks/usePlans'
import { formatReference, getChapterLocation } from './services/bibleService'

type Tab = 'read' | 'plans'

function App() {
  const { data, loading, error } = useBible()
  const { plans, addPlan, removePlan, getProgress, setProgress } = usePlans()
  const [activeTab, setActiveTab] = useState<Tab>('read')
  const [bookId, setBookId] = useState(1)
  const [chapterId, setChapterId] = useState(1)
  const [pickerOpen, setPickerOpen] = useState(false)

  const navigateToChapter = (nextBookId: number, nextChapterId: number) => {
    setBookId(nextBookId)
    setChapterId(nextChapterId)
    setActiveTab('read')
    setPickerOpen(false)
  }

  const location = data ? getChapterLocation(data, { bookId, chapterId }) : undefined
  const reference = location ? formatReference(location) : 'Быт. 1'

  return (
    <div className={`app${pickerOpen ? ' app--sheet-open' : ''}`}>
      {!pickerOpen && (
        <header className="app-header">
          {activeTab === 'read' ? (
            <button type="button" className="header-picker" onClick={() => setPickerOpen(true)}>
              <span className="header-picker__label">Синодальный перевод</span>
              <span className="header-picker__value">
                {reference}
                <span className="header-picker__chevron" aria-hidden="true">›</span>
              </span>
            </button>
          ) : (
            <div>
              <h1 className="app-header__title">Планы</h1>
              <p className="app-header__subtitle">Чтение по расписанию</p>
            </div>
          )}
        </header>
      )}

      <main className="reader">
        {loading && <div className="loading-card">Загрузка текста Библии…</div>}
        {error && <div className="error-card">{error}</div>}

        {!loading && !error && data && activeTab === 'read' && (
          <ReadingView
            data={data}
            bookId={bookId}
            chapterId={chapterId}
            pickerOpen={pickerOpen}
            onPickerOpenChange={setPickerOpen}
            onNavigate={(nextBookId, nextChapterId) => {
              setBookId(nextBookId)
              setChapterId(nextChapterId)
            }}
          />
        )}

        {!loading && !error && data && activeTab === 'plans' && (
          <PlansView
            data={data}
            plans={plans}
            getProgress={getProgress}
            setProgress={setProgress}
            onAddPlan={(input) => addPlan(data, input)}
            onRemovePlan={removePlan}
            onOpenChapter={navigateToChapter}
          />
        )}
      </main>

      {!pickerOpen && <BottomNav activeTab={activeTab} onChange={setActiveTab} />}
    </div>
  )
}

export default App
