import { useState, type UIEvent } from 'react'

export function useCondensedHeader(threshold = 18) {
  const [condensed, setCondensed] = useState(false)

  const onScroll = (event: UIEvent<HTMLElement>) => {
    const next = event.currentTarget.scrollTop > threshold
    setCondensed((current) => (current === next ? current : next))
  }

  return { condensed, onScroll }
}
