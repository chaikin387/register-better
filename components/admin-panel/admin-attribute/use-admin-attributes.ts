'use client'

import type { AdminAttributeSelectItem } from '@/types/admin-attribute.selects'
import { useState } from 'react'

export function useAdminAttributes() {
  const [createOpen, setCreateOpen] = useState(false)
  const [updateAttribute, setUpdateAttribute] =
    useState<AdminAttributeSelectItem | null>(null)
  const [deleteAttribute, setDeleteAttribute] =
    useState<AdminAttributeSelectItem | null>(null)

  return {
    createOpen,
    updateAttribute,
    deleteAttribute,
    setCreateOpen,
    setUpdateAttribute,
    setDeleteAttribute,
  }
}
