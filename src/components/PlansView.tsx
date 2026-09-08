import { useMemo, useRef, useState } from 'react'
import type { BibleData } from '../types/bible'
import type { ReadingPlan } from '../types/plans'
import { SCOPE_LABELS } from '../data/constants'
import { getPlanStats } from '../services/planService'
import { useCondensedHeader } from '../hooks/useCondensedHeader'
import { usePresence } from '../hooks/usePresence'
import { ConfirmDialog } from './ConfirmDialog'
import { PlanCreateSheet } from './PlanCreateSheet'
import { PlanDetailView } from './PlanDetailView'
import { ProgressRing } from './ProgressRing'
import { SwipeRow } from './SwipeRow'
import { ChevronRightIcon } from './icons'

interface PlansViewProps {
  data: BibleData
  plans: ReadingPlan[]
  getProgress: (planId: string) => string[]
  setProgress: (planId: string, readChapters: string[]) => void
  onAddPlan: (input: {
    name: string
    scope: ReadingPlan['scope']
    durationDays: number
    startDate: string
  }) => ReadingPlan
  onRemovePlan: (planId: string) => void
  onOpenChapter: (bookId: number, chapterId: number) => void
}

export function PlansView({
  data,
  plans,
  getProgress,
  setProgress,
  onAddPlan,
  onRemovePlan,
  onOpenChapter,
}: PlansViewProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [progressMap, setProgressMap] = useState<Record<string, string[]>>({})
  const [pendingDelete, setPendingDelete] = useState<ReadingPlan | null>(null)
  const lastPlanRef = useRef<ReadingPlan | null>(null)
  const { condensed, onScroll } = useCondensedHeader(28)

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? null
  if (selectedPlan) lastPlanRef.current = selectedPlan
  const { mounted: detailMounted, visible: detailVisible } = usePresence(!!selectedPlanId, 360)
  const detailPlan = selectedPlan ?? lastPlanRef.current

  const readChaptersFor = (planId: string) => progressMap[planId] ?? getProgress(planId)

  const handleProgressChange = (planId: string, readChapters: string[]) => {
    setProgress(planId, readChapters)
    setProgressMap((current) => ({ ...current, [planId]: readChapters }))
  }

  const planCards = useMemo(
    () =>
      plans.map((plan) => ({
        plan,
        stats: getPlanStats(plan, readChaptersFor(plan.id)),
      })),
    [plans, progressMap, getProgress],
  )

  return (
    <div className="plans-screen">
      <header className={`nav-bar nav-bar--large${condensed ? ' is-condensed' : ''}`}>
        <span className="nav-bar__slot" />
        <h1 className="nav-bar__title">Планы чтения</h1>
        <button type="button" className="nav-text nav-bar__slot" onClick={() => setCreateOpen(true)}>
          Добавить
        </button>
      </header>

      <div className="plans-body" onScroll={onScroll}>
        <h2 className="large-title">Планы чтения</h2>

        {plans.length === 0 ? (
          <div className="empty-card">
            <p className="empty-card__title">Пока нет планов</p>
            <p className="empty-card__text">
              Создайте план для всей Библии, Ветхого или Нового Завета — главы распределятся по дням.
            </p>
            <button type="button" className="primary-button" onClick={() => setCreateOpen(true)}>
              Создать план
            </button>
          </div>
        ) : (
          <>
            <div className="plan-list">
              {planCards.map(({ plan, stats }) => (
                <SwipeRow
                  key={plan.id}
                  actionLabel="Удалить"
                  onAction={() => setPendingDelete(plan)}
                >
                  <button type="button" className="plan-card" onClick={() => setSelectedPlanId(plan.id)}>
                    <ProgressRing value={stats.percent} />
                    <span className="plan-card__body">
                      <span className="plan-card__title">{plan.name}</span>
                      <span className="plan-card__meta">
                        {SCOPE_LABELS[plan.scope]} · {plan.durationDays} дней
                      </span>
                      <span className="plan-card__stats">
                        {stats.readChapters} из {stats.totalChapters} глав · {stats.completedDays} дн. завершено
                      </span>
                    </span>
                    <span className="plan-card__chevron" aria-hidden="true">
                      <ChevronRightIcon />
                    </span>
                  </button>
                </SwipeRow>
              ))}
            </div>
            <p className="list-hint">Смахните карточку влево, чтобы удалить план</p>
          </>
        )}
      </div>

      {detailMounted && detailPlan && (
        <div className={`push-screen${detailVisible ? ' is-open' : ''}`}>
          <PlanDetailView
            plan={detailPlan}
            data={data}
            readChapters={readChaptersFor(detailPlan.id)}
            onBack={() => setSelectedPlanId(null)}
            onProgressChange={(readChapters) => handleProgressChange(detailPlan.id, readChapters)}
            onOpenChapter={onOpenChapter}
          />
        </div>
      )}

      <PlanCreateSheet
        open={createOpen}
        data={data}
        onClose={() => setCreateOpen(false)}
        onCreate={(input) => {
          const plan = onAddPlan(input)
          setProgressMap((current) => ({ ...current, [plan.id]: [] }))
          return plan
        }}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Удалить «${pendingDelete?.name ?? ''}»?`}
        message="Прогресс чтения по этому плану будет удалён без возможности восстановления."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) onRemovePlan(pendingDelete.id)
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
