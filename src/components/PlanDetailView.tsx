import { useMemo, useState } from 'react'
import type { BibleData } from '../types/bible'
import type { ReadingPlan } from '../types/plans'
import {
  formatDisplayDate,
  getDayProgress,
  getPlanStats,
  isToday,
  setDayRead,
  toggleChapterRead,
} from '../services/planService'
import { formatReference, getChapterLocation } from '../services/bibleService'
import { chapterKey } from '../lib/chapterKey'
import { SCOPE_LABELS } from '../data/constants'
import { ProgressBar } from './ProgressBar'
import { CheckIcon, ChevronLeftIcon } from './icons'

interface PlanDetailViewProps {
  plan: ReadingPlan
  data: BibleData
  readChapters: string[]
  onBack: () => void
  onProgressChange: (readChapters: string[]) => void
  onOpenChapter: (bookId: number, chapterId: number) => void
}

export function PlanDetailView({
  plan,
  data,
  readChapters,
  onBack,
  onProgressChange,
  onOpenChapter,
}: PlanDetailViewProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(() => {
    const today = plan.days.find((day) => isToday(day.date))
    return today?.dayIndex ?? 0
  })

  const stats = useMemo(() => getPlanStats(plan, readChapters), [plan, readChapters])

  const handleToggleChapter = (bookId: number, chapterId: number) => {
    onProgressChange(toggleChapterRead(plan.id, { bookId, chapterId }, readChapters))
  }

  const handleToggleDay = (dayIndex: number, read: boolean) => {
    const day = plan.days[dayIndex]
    onProgressChange(setDayRead(plan.id, day, readChapters, read))
  }

  return (
    <div className="plan-detail">
      <button type="button" className="back-link" onClick={onBack}>
        <ChevronLeftIcon />
        <span>Все планы</span>
      </button>

      <div className="plan-hero">
        <h2 className="plan-hero__title">{plan.name}</h2>
        <p className="plan-hero__meta">
          {SCOPE_LABELS[plan.scope]} · {plan.durationDays} дней
        </p>
        <ProgressBar value={stats.percent} label="Общий прогресс" />
        <div className="plan-stats-row">
          <div className="stat-pill">
            <strong>{stats.percent}%</strong>
            <span>прочитано</span>
          </div>
          <div className="stat-pill">
            <strong>{stats.readChapters}/{stats.totalChapters}</strong>
            <span>глав</span>
          </div>
          <div className="stat-pill">
            <strong>{stats.completedDays}/{stats.totalDays}</strong>
            <span>дней</span>
          </div>
        </div>
      </div>

      <div className="day-list">
        {plan.days.map((day) => {
          const progress = getDayProgress(day, readChapters)
          const expanded = expandedDay === day.dayIndex
          const today = isToday(day.date)

          return (
            <section
              key={day.dayIndex}
              className={`day-card${today ? ' day-card--today' : ''}${progress.complete ? ' day-card--complete' : ''}`}
            >
            <div className="day-card__header">
                <button
                  type="button"
                  className="day-card__info-btn"
                  onClick={() => setExpandedDay(expanded ? null : day.dayIndex)}
                >
                  <div className="day-card__info">
                    <span className="day-card__date">
                      {formatDisplayDate(day.date)}
                      {today && <span className="today-badge">Сегодня</span>}
                    </span>
                    <span className="day-card__summary">
                      {day.chapters.length} глав · {progress.read}/{progress.total} · {progress.percent}%
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  className={`day-toggle${progress.complete ? ' day-toggle--done' : ''}`}
                  aria-label={progress.complete ? 'Отметить день непрочитанным' : 'Отметить день прочитанным'}
                  onClick={() => handleToggleDay(day.dayIndex, !progress.complete)}
                >
                  <CheckIcon />
                </button>
              </div>

              <ProgressBar value={progress.percent} size="sm" />

              {expanded && (
                <div className="day-card__chapters">
                  {day.chapters.map((chapter) => {
                    const location = getChapterLocation(data, chapter)
                    const key = chapterKey(chapter)
                    const read = readChapters.includes(key)

                    return (
                      <div key={key} className={`chapter-row${read ? ' chapter-row--read' : ''}`}>
                        <button
                          type="button"
                          className="chapter-row__toggle"
                          onClick={() => handleToggleChapter(chapter.bookId, chapter.chapterId)}
                        >
                          <span className={`chapter-row__check${read ? ' chapter-row__check--on' : ''}`}>
                            {read && <CheckIcon />}
                          </span>
                          <span className="chapter-row__label">
                            {location ? formatReference(location) : key}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="chapter-row__open"
                          onClick={() => onOpenChapter(chapter.bookId, chapter.chapterId)}
                        >
                          Читать
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
