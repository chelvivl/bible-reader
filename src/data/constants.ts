import type { DurationPreset, PlanScope } from '../types/plans'

export const OT_LAST_BOOK_ID = 39
export const NT_FIRST_BOOK_ID = 40

export const SCOPE_LABELS: Record<PlanScope, string> = {
  all: 'Вся Библия',
  ot: 'Ветхий Завет',
  nt: 'Новый Завет',
}

export const DURATION_PRESETS: Record<Exclude<DurationPreset, 'custom'>, number> = {
  '1y': 365,
  '6m': 182,
  '3m': 90,
  '1m': 30,
}

export const DURATION_LABELS: Record<DurationPreset, string> = {
  '1y': '1 год',
  '6m': 'Полгода',
  '3m': '3 месяца',
  '1m': '1 месяц',
  custom: 'Произвольный',
}
