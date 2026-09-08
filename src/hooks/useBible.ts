import { useEffect, useState } from 'react'
import type { BibleData } from '../types/bible'
import { loadBible } from '../services/bibleService'

export function useBible() {
  const [data, setData] = useState<BibleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    loadBible()
      .then((bible) => {
        if (active) setData(bible)
      })
      .catch((err: Error) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { data, loading, error }
}
