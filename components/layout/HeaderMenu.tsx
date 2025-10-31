'use client'

import { useEffect, useState } from 'react'
import { logout } from '@/lib/clientAuth'
import { useRouter } from 'next/navigation'
import { deleteAccount } from '@/services/authService'
import { Sun, Moon, LogOut, Trash2 } from 'lucide-react'

export default function HeaderMenu({ onClose, openDeleteModal }: { onClose?: () => void, openDeleteModal?: () => void }) {
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
    onClose?.()
  }

  const handleLogout = () => {
    logout(router.push)
    onClose?.()
  }


  const menuButtonClass = 'w-full text-left px-3 py-2 flex items-center gap-2 rounded-md text-sm transition-colors'

  return (
    <>
      <div className="flex flex-col min-w-[180px]">
        <button 
            onClick={toggleTheme} 
            className={menuButtonClass + ' cursor-pointer ' + (darkMode ? 'hover:text-black hover:bg-[#e6edf3]' : 'hover:text-white hover:bg-[#0d1117]')}
          >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          <span className="flex-1">{darkMode ? 'Mode clair' : 'Mode sombre'}</span>
        </button>

        <button
          onClick={handleLogout}
          className={menuButtonClass + ' cursor-pointer hover:bg-red-600 hover:text-white'}
        >
          <LogOut size={16} />
          <span className="flex-1">Déconnexion</span>
        </button>

        <button
          onClick={openDeleteModal}
          className={menuButtonClass + ' cursor-pointer hover:bg-red-600 hover:text-white'}
        >
          <Trash2 size={16} />
          <span className="flex-1">Supprimer le compte</span>
        </button>
      </div>
    </>
  )
}