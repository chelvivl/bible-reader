import { useState } from 'react'
import { BottomNav } from './components/BottomNav'
import { PlansView } from './components/PlansView'
import { ReadingView } from './components/ReadingView'
import { useBible } from './hooks/useBible'
import { usePlans } from './hooks/usePlans'

type Tab = 'read' | 'plans'

function App() {
  const { data, loading, error } = useBible()
  const { plans, addPlan, removePlan, getProgress, setProgress } = usePlans()
  const [activeTab, setActiveTab] = useState<Tab>('read')
  const [bookId, setBookId] = useState(1)
  const [chapterId, setChapterId] = useState(1)

  const navigateToChapter = (nextBookId: number, nextChapterId: number) => {
    setBookId(nextBookId)
    setChapterId(nextChapterId)
    setActiveTab('read')
  }

  return (
    <div className="app">
      <div className="screen-stack">
        {loading && <div className="loading-card">Загрузка текста Библии…</div>}
        {error && <div className="error-card">{error}</div>}

        {!loading && !error && data && (
          <>
            <section
              className={`screen screen--read${activeTab === 'read' ? ' is-active' : ''}`}
              aria-hidden={activeTab !== 'read'}
            >
              <ReadingView
                data={data}
                bookId={bookId}
                chapterId={chapterId}
                onNavigate={(nextBookId, nextChapterId) => {
                  setBookId(nextBookId)
                  setChapterId(nextChapterId)
                }}
              />
            </section>

            <section
              className={`screen screen--plans${activeTab === 'plans' ? ' is-active' : ''}`}
              aria-hidden={activeTab !== 'plans'}
            >
              <PlansView
                data={data}
                plans={plans}
                getProgress={getProgress}
                setProgress={setProgress}
                onAddPlan={(input) => addPlan(data, input)}
                onRemovePlan={removePlan}
                onOpenChapter={navigateToChapter}
              />
            </section>
          </>
        )}
      </div>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}

export default App
