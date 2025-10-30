'use client'

import { useEffect, useState } from 'react'
import { logout } from '@/lib/clientAuth'
import { useRouter } from 'next/navigation'

export default function HeaderMenu({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const savedTheme = localStorage.getItem('theme')
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark
    setDarkMode(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggleTheme = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    document.documentElement.classList.toggle('dark', newMode)
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
    onClose()
  }

  const handleLogout = () => {
    onClose()
    logout(router.push)
  }

  return (
    <div className="flex flex-col p-1">
      <button
        onClick={toggleTheme}
        className="text-[var(--primary)] hover:text-black cursor-pointer flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-[#d0d7de] rounded-md transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          width="16"
          height="16"
        >
          {darkMode ? (
            <path d="M6.995 12c0 2.761 2.246 5 5.005 5s5.005-2.239 5.005-5c0-2.761-2.246-5-5.005-5s-5.005 2.239-5.005 5zm13.002-1h2v2h-2v-2zm-20 0h2v2h-2v-2zm11-11h2v2h-2v-2zm0 20h2v2h-2v-2zm8.949-15.364l1.414 1.414-1.414 1.414-1.414-1.414 1.414-1.414zm-15.898 0l1.414 1.414-1.414 1.414-1.414-1.414 1.414-1.414zm15.898 15.898l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zm-15.898 0l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414z" />
          ) : (
            <path d="M21.752 15.002a9.718 9.718 0 0 1-5.095 2.482 9.755 9.755 0 0 1-7.617-1.736 9.736 9.736 0 0 1-3.701-6.031A9.787 9.787 0 0 1 6.09 4.282 9.755 9.755 0 0 1 13.5 2c5.523 0 10 4.477 10 10 0 1.08-.17 2.125-.482 3.002h-.266z" />
          )}
        </svg>
        {darkMode ? 'Mode clair' : 'Mode sombre'}
      </button>

      <button
        onClick={handleLogout}
        className="cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-red-600 hover:text-white rounded-md transition-colors"
      >
        Déconnexion
      </button>
    </div>
  )
}
