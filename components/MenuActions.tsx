'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'

type MenuActionsProps = {
  onEdit: () => void
  onDelete: () => void
}

export default function MenuActions({ onEdit, onDelete }: MenuActionsProps) {
  
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)

  const handleToggle = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setCoords({ x: rect.right, y: rect.bottom })
    setOpen(!open)
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={handleToggle}
        className="cursor-pointer px-2 py-1 text-sm hover:bg-[#21262d] rounded"
      >
        ⋮
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            className="absolute bg-[#161b22] border border-[#30363d] rounded-md shadow-lg z-[9999]"
            style={{
              top: coords.y + window.scrollY,
              left: coords.x - 128, // largeur du menu
              position: 'absolute',
              width: '128px'
            }}
          >
            <button
              onClick={() => {
                setOpen(false)
                onEdit()
              }}
              className="cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-[#e6edf3] hover:text-black"
            >
              Modifier
            </button>
            <button
              onClick={() => {
                setOpen(false)
                onDelete()
              }}
              className="cursor-pointer block w-full text-left px-3 py-2 text-sm hover:bg-red-600 hover:text-white"
            >
              Supprimer
            </button>
          </div>,
          document.body
        )}
    </div>
  )
}
