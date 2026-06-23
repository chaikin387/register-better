import {
  autoUpdate,
  flip,
  offset,
  safePolygon,
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
    middleware: [offset(8), flip()],
    whileElementsMounted: autoUpdate,
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      enabled,
      handleClose: safePolygon(),
    }),
  ])

  return {
    open,
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
  }
}
