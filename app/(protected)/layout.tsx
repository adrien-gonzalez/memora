'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Décoder un JWT sans vérification cryptographique (juste expiration)
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
      return
    }

    const decoded = parseJwt(token)
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      // 🔒 Token expiré ou corrompu
      localStorage.removeItem('token')
      router.push('/login')
      return
    }

    // ✅ Token présent et non expiré
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        Vérification de la session...
      </div>
    )
  }

  return <>{children}</>
}
