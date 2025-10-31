'use client'
import { useState } from 'react'
import { loginUser } from '@/services/authService'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await loginUser(email, password)
      if (res.success && res.token) {
        localStorage.setItem('token', res.token)
        router.push('/')
      } else {
        setError(res.error || 'Erreur de connexion')
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion')
    }
  }

  return (
    <div className="mt-[25vh] flex items-center justify-center bg-[var(--background)]">
      <form onSubmit={handleSubmit} className="bg-[var(--background)] p-6 rounded-lg w-96 space-y-4 border border-[#30363d]">
        <h2 className="text-xl font-bold text-[var(--primary)] text-center">Connexion</h2>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 text-xs">* {error}</p>}

        <button type="submit" className="cursor-pointer w-full text-black p-2 rounded bg-[#e6edf3] hover:bg-[#d0d7de]">
          Se connecter
        </button>

        {/* 🔗 Lien vers la page d'inscription */}
        <p className="text-center text-sm text-gray-400">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-[var(--primary)] hover:underline">
            Inscris-toi ici
          </Link>
        </p>
      </form>
    </div>
  )
}
