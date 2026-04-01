import { useRef, useCallback } from 'react'

export function useScrollToResult() {
  const resultRef = useRef<HTMLElement>(null)

  const scrollToResult = useCallback(() => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }, [])

  return { resultRef, scrollToResult }
}
