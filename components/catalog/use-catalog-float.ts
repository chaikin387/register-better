import {
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react'
import { useState } from 'react'

export const useCatalogFloat = (enabled: boolean) => {
  const [open, setOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'right-start',
    middleware: [offset(8), flip({ padding: 12 }), shift({ padding: 12 })],
    whileElementsMounted: autoUpdate,
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      enabled,
      delay: { open: 50, close: 100 },
      handleClose: safePolygon({ buffer: 1 }),
    }),
  ])

  return { open, refs, floatingStyles, getReferenceProps, getFloatingProps }
}
