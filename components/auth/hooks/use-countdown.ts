import { useEffect, useEffectEvent, useState } from 'react'

export function useCountdown(seconds: number, onComplete?: () => void) {
  const [countdown, setCountdown] = useState(0)

  const handleComplete = useEffectEvent(() => {
    onComplete?.()
  })

  const start = () => setCountdown(seconds)

  useEffect(() => {
    if (countdown <= 0) {
      handleComplete()
      return
    }

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  return { countdown, start }
}
