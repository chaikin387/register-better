'use client'

import type { AdminAttributeValueSelectItem } from '@/types/admin-attribute-value.selects'
import { useState } from 'react'

export function useAdminAttributeValues() {
  const [createOpen, setCreateOpen] = useState(false)
  const [updateValue, setUpdateValue] =
    useState<AdminAttributeValueSelectItem | null>(null)
  const [deleteValue, setDeleteValue] =
    useState<AdminAttributeValueSelectItem | null>(null)

  return {
    createOpen,
    updateValue,
    deleteValue,
    setCreateOpen,
    setUpdateValue,
    setDeleteValue,
  }
}
