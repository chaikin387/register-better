'use client'

import { useState } from 'react'
import { updateName } from './action.name'

export function useName(initialName: string) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [value, setValue] = useState(initialName)

  async function onSave() {
    if (value.trim() === initialName) {
      setEditing(false)
      return
    }
    if (!value.trim()) {
      setError('Имя не может быть пустым')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const res = await updateName(value)
      if (res?.error) setError(res.error)
      else setEditing(false)
    } finally {
      setLoading(false)
    }
  }

  function onCancel() {
    setValue(initialName)
    setEditing(false)
    setError(null)
  }

  return {
    value,
    setValue,
    editing,
    setEditing,
    loading,
    error,
    onSave,
    onCancel,
  }
}
