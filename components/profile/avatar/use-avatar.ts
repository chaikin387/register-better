'use client'

import { useRef, useState } from 'react'
import { resetAvatar, uploadAvatar } from './action.avatar'

export function useAvatar() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onUpload(file?: File) {
    if (!file) return
    setError(null)

    const formData = new FormData()
    formData.append('avatar', file)
    if (fileRef.current) fileRef.current.value = ''

    setLoading(true)
    try {
      const res = await uploadAvatar(formData)
      if (res?.error) setError(res.error)
    } finally {
      setLoading(false)
    }
  }

  async function onReset() {
    setError(null)
    setLoading(true)
    try {
      const res = await resetAvatar()
      if (res?.error) setError(res.error)
    } finally {
      setLoading(false)
    }
  }

  return { fileRef, loading, error, onUpload, onReset }
}
