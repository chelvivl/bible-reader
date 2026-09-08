import { useMemo, useState } from 'react'
import type { BibleData } from '../types/bible'
import type { ReadingPlan } from '../types/plans'
import { SCOPE_LABELS } from '../data/constants'
import { getPlanStats } from '../services/planService'
import { PlanCreateSheet } from './PlanCreateSheet'
import { PlanDetailView } from './PlanDetailView'
import { ProgressBar } from './ProgressBar'
import { PlusIcon } from './icons'

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

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId)

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

  if (selectedPlan) {
    return (
      <PlanDetailView
        plan={selectedPlan}
        data={data}
        readChapters={readChaptersFor(selectedPlan.id)}
        onBack={() => setSelectedPlanId(null)}
        onProgressChange={(readChapters) => handleProgressChange(selectedPlan.id, readChapters)}
        onOpenChapter={(bookId, chapterId) => {
          onOpenChapter(bookId, chapterId)
        }}
      />
    )
  }

  return (
    <>
      <div className="section-header">
        <div>
          <h2 className="section-title">Планы чтения</h2>
          <p className="section-subtitle">Распределите главы по дням и отмечайте прогресс</p>
        </div>
        <button type="button" className="fab" aria-label="Создать план" onClick={() => setCreateOpen(true)}>
          <PlusIcon />
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="empty-card">
          <p className="empty-card__title">Пока нет планов</p>
          <p className="empty-card__text">
            Создайте план для всей Библии, Ветхого или Нового Завета — приложение распределит главы по дням.
          </p>
          <button type="button" className="primary-button" onClick={() => setCreateOpen(true)}>
            Создать первый план
          </button>
        </div>
      ) : (
        <div className="plan-list">
          {planCards.map(({ plan, stats }) => (
            <article key={plan.id} className="plan-card">
              <button type="button" className="plan-card__main" onClick={() => setSelectedPlanId(plan.id)}>
                <div className="plan-card__head">
                  <h3>{plan.name}</h3>
                  <span>{stats.percent}%</span>
                </div>
                <p className="plan-card__meta">
                  {SCOPE_LABELS[plan.scope]} · {plan.durationDays} дней
                </p>
                <ProgressBar value={stats.percent} size="sm" />
                <p className="plan-card__stats">
                  {stats.readChapters} из {stats.totalChapters} глав · {stats.completedDays} дней завершено
                </p>
              </button>
              <button
                type="button"
                className="text-button text-button--danger"
                onClick={() => onRemovePlan(plan.id)}
              >
                Удалить
              </button>
            </article>
          ))}
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
    </>
  )
}
