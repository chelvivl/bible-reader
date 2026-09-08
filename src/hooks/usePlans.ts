import { useCallback, useEffect, useState } from 'react'
import type { ReadingPlan } from '../types/plans'
import {
  createReadingPlan,
  deletePlan as deletePlanStorage,
  getPlanProgress,
  loadPlans,
  savePlans,
  updatePlanProgress,
} from '../services/planService'
import type { BibleData } from '../types/bible'

export function usePlans() {
  const [plans, setPlans] = useState<ReadingPlan[]>(() => loadPlans())

  useEffect(() => {
    savePlans(plans)
  }, [plans])

  const addPlan = useCallback(
    (data: BibleData, input: Parameters<typeof createReadingPlan>[1]) => {
      const plan = createReadingPlan(data, input)
      setPlans((current) => [plan, ...current])
      updatePlanProgress(plan.id, [])
      return plan
    },
    [],
  )

  const removePlan = useCallback((planId: string) => {
    deletePlanStorage(planId)
    setPlans((current) => current.filter((plan) => plan.id !== planId))
  }, [])

  const getProgress = useCallback((planId: string) => getPlanProgress(planId).readChapters, [])

  const setProgress = useCallback((planId: string, readChapters: string[]) => {
    updatePlanProgress(planId, readChapters)
  }, [])

  return { plans, addPlan, removePlan, getProgress, setProgress }
}
