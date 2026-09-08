import type { BibleData, ChapterRef } from '../types/bible'
import type { DayProgress, PlanProgress, PlanStats, PlanDay, ReadingPlan } from '../types/plans'
import { getAllChapterRefs } from './bibleService'
import { chapterKey } from '../lib/chapterKey'

const PLANS_KEY = 'bible-reader:plans'
const PROGRESS_KEY = 'bible-reader:plan-progress'

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function distributeChapters(chapters: ChapterRef[], durationDays: number): ChapterRef[][] {
  const buckets: ChapterRef[][] = Array.from({ length: durationDays }, () => [])
  if (durationDays <= 0) return buckets

  const base = Math.floor(chapters.length / durationDays)
  const remainder = chapters.length % durationDays
  let index = 0

  for (let day = 0; day < durationDays; day++) {
    const count = base + (day < remainder ? 1 : 0)
    buckets[day] = chapters.slice(index, index + count)
    index += count
  }

  return buckets
}

export function buildPlanDays(
  chapters: ChapterRef[],
  durationDays: number,
  startDate: string,
): PlanDay[] {
  const buckets = distributeChapters(chapters, durationDays)
  return buckets.map((dayChapters, dayIndex) => ({
    dayIndex,
    date: addDays(startDate, dayIndex),
    chapters: dayChapters,
  }))
}

export function createReadingPlan(
  data: BibleData,
  input: {
    name: string
    scope: ReadingPlan['scope']
    durationDays: number
    startDate: string
  },
): ReadingPlan {
  const chapters = getAllChapterRefs(data, input.scope)
  const days = buildPlanDays(chapters, input.durationDays, input.startDate)

  return {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    scope: input.scope,
    durationDays: input.durationDays,
    startDate: input.startDate,
    createdAt: new Date().toISOString(),
    days,
  }
}

export function loadPlans(): ReadingPlan[] {
  try {
    const raw = localStorage.getItem(PLANS_KEY)
    return raw ? (JSON.parse(raw) as ReadingPlan[]) : []
  } catch {
    return []
  }
}

export function savePlans(plans: ReadingPlan[]): void {
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans))
}

export function loadAllProgress(): PlanProgress[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? (JSON.parse(raw) as PlanProgress[]) : []
  } catch {
    return []
  }
}

export function saveAllProgress(progress: PlanProgress[]): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function getPlanProgress(planId: string): PlanProgress {
  const all = loadAllProgress()
  return all.find((item) => item.planId === planId) ?? { planId, readChapters: [] }
}

export function updatePlanProgress(planId: string, readChapters: string[]): void {
  const all = loadAllProgress()
  const index = all.findIndex((item) => item.planId === planId)
  const next = { planId, readChapters: [...new Set(readChapters)] }
  if (index === -1) all.push(next)
  else all[index] = next
  saveAllProgress(all)
}

export function getDayProgress(day: PlanDay, readChapters: string[]): DayProgress {
  const readSet = new Set(readChapters)
  const total = day.chapters.length
  const read = day.chapters.filter((chapter) => readSet.has(chapterKey(chapter))).length
  const percent = total === 0 ? 100 : Math.round((read / total) * 100)
  return { total, read, percent, complete: total > 0 && read === total }
}

export function getPlanStats(plan: ReadingPlan, readChapters: string[]): PlanStats {
  const readSet = new Set(readChapters)
  const totalChapters = plan.days.reduce((sum, day) => sum + day.chapters.length, 0)
  const readCount = plan.days.reduce(
    (sum, day) => sum + day.chapters.filter((chapter) => readSet.has(chapterKey(chapter))).length,
    0,
  )
  const completedDays = plan.days.filter((day) => getDayProgress(day, readChapters).complete).length
  const percent = totalChapters === 0 ? 0 : Math.round((readCount / totalChapters) * 100)

  return {
    totalChapters,
    readChapters: readCount,
    percent,
    completedDays,
    totalDays: plan.days.length,
  }
}

export function toggleChapterRead(
  planId: string,
  chapter: ChapterRef,
  readChapters: string[],
): string[] {
  const key = chapterKey(chapter)
  const set = new Set(readChapters)
  if (set.has(key)) set.delete(key)
  else set.add(key)
  const next = [...set]
  updatePlanProgress(planId, next)
  return next
}

export function setDayRead(
  planId: string,
  day: PlanDay,
  readChapters: string[],
  read: boolean,
): string[] {
  const set = new Set(readChapters)
  for (const chapter of day.chapters) {
    const key = chapterKey(chapter)
    if (read) set.add(key)
    else set.delete(key)
  }
  const next = [...set]
  updatePlanProgress(planId, next)
  return next
}

export function deletePlan(planId: string): void {
  savePlans(loadPlans().filter((plan) => plan.id !== planId))
  saveAllProgress(loadAllProgress().filter((item) => item.planId !== planId))
}

export function formatDisplayDate(isoDate: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${isoDate}T12:00:00`))
}

export function isToday(isoDate: string): boolean {
  const today = new Date().toISOString().slice(0, 10)
  return isoDate === today
}
