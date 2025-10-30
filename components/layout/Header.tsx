'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import HeaderMenu from './HeaderMenu'

type HeaderProps = {
  selectedSubcategory?: string
  onNewCategory: () => void
  onNewSubcategory: () => void
  onNewNote: (subcategoryId?: string) => void
}

export default function Header({
  selectedSubcategory,
  onNewCategory,
  onNewSubcategory,
  onNewNote,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)

  const handleSettingsClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setCoords({ x: rect.right, y: rect.bottom })
    setMenuOpen(!menuOpen)
  }

  const handleCloseMenu = () => setMenuOpen(false)

  return (
    <header className="bg-[var(--background)] border border-[#30363d] px-6 py-4 rounded-md relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-semibold">Penses-Bêtes</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={onNewCategory}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[var(--button)] hover:bg-[var(--hover)] border border-[#30363d] rounded-md text-sm font-medium transition-colors"
          >
            <span className="text-lg">📁</span>
            <span>Catégorie</span>
          </button>

          <button
            onClick={onNewSubcategory}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[var(--button)] hover:bg-[var(--hover)] border border-[#30363d] rounded-md text-sm font-medium transition-colors"
          >
            <span className="text-lg">📂</span>
            <span>Sous-catégorie</span>
          </button>

          <button
            onClick={() => onNewNote(selectedSubcategory)}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#e6edf3] hover:bg-[#d0d7de] text-[#0d1117] rounded-md text-sm font-medium transition-colors"
          >
            <span className="text-lg">+</span>
            <span>Pense-Bête</span>
          </button>
        </div>
      </div>

      {/* Bouton de paramètres fixe en haut à droite */}
      <div className="fixed top-6 right-4 z-[1000]">
        <button
          onClick={handleSettingsClick}
          className="cursor-pointer text-[var(--primary)] hover:text-[#7d8590] p-2 rounded-full bg-[var(--button)] hover:bg-[var(--hover)] transition-colors"
          aria-label="Menu paramètres"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path d="M19.14,12.936a7.963,7.963,0,0,0,.06-.936,7.963,7.963,0,0,0-.06-.936l2.11-1.65a.5.5,0,0,0,.12-.64l-2-3.464a.5.5,0,0,0-.6-.22l-2.49,1a7.994,7.994,0,0,0-1.62-.936l-.38-2.65A.5.5,0,0,0,13.75,2h-3.5a.5.5,0,0,0-.49.42l-.38,2.65a7.994,7.994,0,0,0-1.62.936l-2.49-1a.5.5,0,0,0-.6.22l-2,3.464a.5.5,0,0,0,.12.64l2.11,1.65a7.963,7.963,0,0,0-.06.936,7.963,7.963,0,0,0,.06.936l-2.11,1.65a.5.5,0,0,0-.12.64l2,3.464a.5.5,0,0,0,.6.22l2.49-1a7.994,7.994,0,0,0,1.62.936l.38,2.65a.5.5,0,0,0,.49.42h3.5a.5.5,0,0,0,.49-.42l.38-2.65a7.994,7.994,0,0,0,1.62-.936l2.49,1a.5.5,0,0,0,.6-.22l2-3.464a.5.5,0,0,0-.12-.64Zm-7.14,2.064A3,3,0,1,1,15,12,3,3,0,0,1,12,15Z" />
          </svg>
        </button>
      </div>

      {/* Menu flottant (via portal) */}
      {menuOpen &&
        coords &&
        createPortal(
          <div
            className="absolute bg-[var(--background)] border border-[#30363d] rounded-md shadow-lg z-[9999]"
            style={{
              top: coords.y + window.scrollY + 8,
              right: 15,
              position: 'absolute',
              width: '160px',
            }}
          >
            <HeaderMenu onClose={handleCloseMenu} />
          </div>,
          document.body
        )}
    </header>
  )
}
