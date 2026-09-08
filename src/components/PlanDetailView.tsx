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
import { ProgressRing } from './ProgressRing'
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
    <div className="detail-screen">
      <header className="nav-bar">
        <button type="button" className="nav-text nav-text--back nav-bar__slot" onClick={onBack}>
          <ChevronLeftIcon />
          Планы
        </button>
        <h2 className="nav-bar__title">{plan.name}</h2>
        <span className="nav-bar__slot" />
      </header>

      <div className="detail-body">
        <section className="hero-card">
          <ProgressRing value={stats.percent} size={68} />
          <div className="hero-card__info">
            <h3 className="hero-card__title">{plan.name}</h3>
            <p className="hero-card__meta">
              {SCOPE_LABELS[plan.scope]} · {plan.durationDays} дней
            </p>
            <ProgressBar value={stats.percent} size="sm" />
          </div>
        </section>

        <div className="stat-grid">
          <div className="stat-cell">
            <strong>{stats.readChapters}</strong>
            <span>глав прочитано</span>
          </div>
          <div className="stat-cell">
            <strong>{stats.totalChapters - stats.readChapters}</strong>
            <span>осталось</span>
          </div>
          <div className="stat-cell">
            <strong>
              {stats.completedDays}/{stats.totalDays}
            </strong>
            <span>дней</span>
          </div>
        </div>

        <h4 className="section-title">Расписание</h4>

        <div className="day-list">
          {plan.days.map((day) => {
            const progress = getDayProgress(day, readChapters)
            const expanded = expandedDay === day.dayIndex
            const today = isToday(day.date)

            return (
              <section
                key={day.dayIndex}
                className={`day-card${today ? ' day-card--today' : ''}${
                  progress.complete ? ' day-card--complete' : ''
                }`}
              >
                <div className="day-card__header">
                  <button
                    type="button"
                    className="day-card__info-btn"
                    onClick={() => setExpandedDay(expanded ? null : day.dayIndex)}
                  >
                    <span className="day-card__date">
                      {formatDisplayDate(day.date)}
                      {today && <span className="today-badge">Сегодня</span>}
                    </span>
                    <span className="day-card__summary">
                      {day.chapters.length} глав · прочитано {progress.read} из {progress.total}
                    </span>
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
                              <CheckIcon />
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
    </div>
  )
}
