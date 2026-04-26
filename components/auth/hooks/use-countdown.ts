import { useEffect, useRef, useState } from 'react'

export function useCountdown(seconds: number, onComplete?: () => void) {
  const [countdown, setCountdown] = useState(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const start = () => setCountdown(seconds)

  useEffect(() => {
    if (countdown <= 0) {
      onCompleteRef.current?.()
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  return { countdown, start }
}
