import { useMemo, useState } from 'react'
import type { BibleData } from '../types/bible'
import type { DurationPreset, PlanScope, ReadingPlan } from '../types/plans'
import {
  DURATION_LABELS,
  DURATION_PRESETS,
  SCOPE_LABELS,
} from '../data/constants'
import { getAllChapterRefs } from '../services/bibleService'
import { FullScreen } from './FullScreen'

interface PlanCreateSheetProps {
  open: boolean
  data: BibleData
  onClose: () => void
  onCreate: (input: {
    name: string
    scope: PlanScope
    durationDays: number
    startDate: string
  }) => ReadingPlan
}

export function PlanCreateSheet({ open, data, onClose, onCreate }: PlanCreateSheetProps) {
  const [name, setName] = useState('')
  const [scope, setScope] = useState<PlanScope>('all')
  const [durationPreset, setDurationPreset] = useState<DurationPreset>('1y')
  const [customDays, setCustomDays] = useState('120')
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))

  const durationDays = useMemo(() => {
    if (durationPreset === 'custom') {
      const value = Number(customDays)
      return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0
    }
    return DURATION_PRESETS[durationPreset]
  }, [durationPreset, customDays])

  const chapterCount = useMemo(() => getAllChapterRefs(data, scope).length, [data, scope])
  const chaptersPerDay = durationDays > 0 ? (chapterCount / durationDays).toFixed(1) : '—'

  const reset = () => {
    setName('')
    setScope('all')
    setDurationPreset('1y')
    setCustomDays('120')
    setStartDate(new Date().toISOString().slice(0, 10))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim() || durationDays <= 0) return

    onCreate({
      name: name.trim(),
      scope,
      durationDays,
      startDate,
    })
    reset()
    onClose()
  }

  return (
    <FullScreen
      open={open}
      title="Новый план"
      onClose={onClose}
      footer={
        <button
          type="submit"
          form="plan-create-form"
          className="primary-button"
          disabled={!name.trim() || durationDays <= 0}
        >
          Создать
        </button>
      }
    >
      <form id="plan-create-form" className="plan-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Название</span>
          <input
            className="field__input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Библия за год"
            required
          />
        </label>

        <fieldset className="field">
          <legend className="field__label">Охват</legend>
          <div className="segmented">
            {(Object.keys(SCOPE_LABELS) as PlanScope[]).map((value) => (
              <button
                key={value}
                type="button"
                className={`segmented__item${scope === value ? ' is-active' : ''}`}
                onClick={() => setScope(value)}
              >
                {SCOPE_LABELS[value]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend className="field__label">Срок</legend>
          <div className="chip-row">
            {(Object.keys(DURATION_LABELS) as DurationPreset[]).map((value) => (
              <button
                key={value}
                type="button"
                className={`chip${durationPreset === value ? ' is-active' : ''}`}
                onClick={() => setDurationPreset(value)}
              >
                {DURATION_LABELS[value]}
              </button>
            ))}
          </div>
          {durationPreset === 'custom' && (
            <input
              className="field__input"
              type="number"
              min={1}
              value={customDays}
              onChange={(event) => setCustomDays(event.target.value)}
              placeholder="Количество дней"
            />
          )}
        </fieldset>

        <label className="field">
          <span className="field__label">Начало</span>
          <input
            className="field__input"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            required
          />
        </label>

        <p className="plan-preview">
          {chapterCount} глав · {durationDays > 0 ? `${durationDays} дн.` : 'укажите срок'} · ~{chaptersPerDay} гл./день
        </p>
      </form>
    </FullScreen>
  )
}
