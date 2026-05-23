import { useEffect, useEffectEvent } from 'react'

export const useEscapeKey = (open: boolean, onClose: () => void): void => {
  const onEscape = useEffectEvent(onClose)

  useEffect(() => {
    if (!open) return

    const handleKeyDown = ({ key }: KeyboardEvent): void => {
      if (key === 'Escape') onEscape()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])
}
