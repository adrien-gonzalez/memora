'use client'

import { useState } from 'react'
import { registerUser } from '@/services/authService'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '@/components/ui/Input'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await registerUser(form)
      if (res.success) {
        router.push('/login')
      } else {
        setError(res.error || 'Erreur lors de l\'inscription')
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
      <form onSubmit={handleSubmit} className="bg-[#161b22] p-6 rounded-lg w-96 space-y-4">
        <h2 className="text-xl font-bold text-white text-center">Créer un compte</h2>

        {['firstName', 'lastName', 'email', 'password'].map(field => (
          <Input
            key={field}
              type={field === 'password' ? 'password' : 'text'}
              placeholder={
                field === 'firstName'
                  ? 'Prénom'
                  : field === 'lastName'
                  ? 'Nom'
                  : field === 'email'
                  ? 'Email'
                  : 'Mot de passe'
              }
              value={(form as any)[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              className="w-full p-2 rounded bg-[#0d1117] border border-[#30363d] text-white"
          />
        ))}

        {error && <p className="text-red-400 text-xs">* {error}</p>}

        <button type="submit" className="cursor-pointer w-full text-black p-2 rounded bg-[#e6edf3] hover:bg-[#d0d7de]">
          S'inscrire
        </button>

        {/* 🔗 Lien vers la page de connexion */}
        <p className="text-center text-sm text-gray-400">
          Déjà inscrit ?{' '}
          <Link href="/login" className="text-white hover:underline">
            Connecte-toi ici
          </Link>
        </p>
      </form>
    </div>
  )
}
