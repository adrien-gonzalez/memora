'use client'

import { logout } from "@/lib/clientAuth"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  
  return (
    <header className="bg-[#161b22] border border-[#30363d] px-6 py-4 rounded-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-semibold">Penses-Bêtes</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={onNewCategory}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md text-sm font-medium transition-colors"
          >
            <span className="text-lg">📁</span>
            <span>Catégorie</span>
          </button>

          <button
            onClick={onNewSubcategory}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md text-sm font-medium transition-colors"
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

            {/* Bouton déconnexion en haut */}
            <div className="flex justify-end p-2">
              <button
                onClick={() => logout(router.push)}
                className="text-white cursor-pointer flex items-center gap-1 px-2 py-1 rounded text-sm hover:text-[#7d8590]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M22.763,10.232l-4.95-4.95L16.4,6.7,20.7,11H6.617v2H20.7l-4.3,4.3,1.414,1.414,4.95-4.95a2.5,2.5,0,0,0,0-3.536Z"/>
                  <path d="M10.476,21a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V3A1,1,0,0,1,3,2H9.476a1,1,0,0,1,1,1V8.333h2V3a3,3,0,0,0-3-3H3A3,3,0,0,0,0,3V21a3,3,0,0,0,3,3H9.476a3,3,0,0,0,3-3V15.667h-2Z"/>
                </svg>
              </button>
            </div>

        </div>
      </div>
    </header>
  )
}
