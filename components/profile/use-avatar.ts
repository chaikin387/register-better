// components/profile/use-avatar.ts
'use client'

import { resetAvatar, uploadAvatar } from '@/components/profile/action.avatar'
import { useRef, useState } from 'react'

export const useAvatar = () => {
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onUpload = async (file?: File) => {
    if (!file) return
    setError(null)

    const formData = new FormData()
    formData.append('avatar', file)

    setLoading(true)
    const res = await uploadAvatar(formData)
    setLoading(false)

    if (fileRef.current) fileRef.current.value = ''

    if (res?.error) setError(res.error)
  }

  const onReset = async () => {
    setError(null)
    setLoading(true)
    const res = await resetAvatar()
    setLoading(false)

    if (res?.error) setError(res.error)
  }

  return { fileRef, loading, error, onUpload, onReset }
}
