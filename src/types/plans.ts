import type { ChapterRef } from './bible'

export type PlanScope = 'all' | 'ot' | 'nt'

export type DurationPreset = '1y' | '6m' | '3m' | '1m' | 'custom'

export interface PlanDay {
  dayIndex: number
  date: string
  chapters: ChapterRef[]
}

export interface ReadingPlan {
  id: string
  name: string
  scope: PlanScope
  durationDays: number
  startDate: string
  createdAt: string
  days: PlanDay[]
}

export interface PlanProgress {
  planId: string
  readChapters: string[]
}

export interface DayProgress {
  total: number
  read: number
  percent: number
  complete: boolean
}

export interface PlanStats {
  totalChapters: number
  readChapters: number
  percent: number
  completedDays: number
  totalDays: number
}
