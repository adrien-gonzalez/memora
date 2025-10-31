'use client'

import { Menu, MenuButton, MenuItems, Transition } from '@headlessui/react'
import HeaderMenu from './HeaderMenu'
import { Fragment, useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import { deleteAccount } from '@/services/authService'
import { logout } from '@/lib/clientAuth'
import { useRouter } from 'next/navigation'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDeleteAccount = async () => {
    setLoading(true)
    const result = await deleteAccount()
    setLoading(false)
    
    if (result.success) {
      setIsModalOpen(false)
      logout(router.push)
    } else {
      alert(result.error || 'Erreur lors de la suppression du compte')
    }
  }

  return (
    <header className="bg-[var(--background)] border border-[#30363d] px-6 py-4 rounded-md relative">
      <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between">
        {/* Titre */}
        <div className='flex gap-4 items-center'>
          <div className='logo w-[55px] h-[45px]'></div>
          <h1 className="text-xl font-semibold w-full sm:w-auto">Penses-Bêtes</h1>
        </div>
        
        {/* Boutons Ajouter */}
        <div className="w-full sm:w-auto flex items-center gap-3 flex-wrap mt-2 sm:mt-0">
          <button
            onClick={onNewCategory}
            className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-[var(--button)] hover:bg-[var(--hover)] border border-[#30363d] rounded-md text-sm font-medium transition-colors"
          >
            <span className="text-lg">📁</span>
            <span>Catégorie</span>
          </button>

          <button
            onClick={onNewSubcategory}
            className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-[var(--button)] hover:bg-[var(--hover)] border border-[#30363d] rounded-md text-sm font-medium transition-colors"
          >
            <span className="text-lg">📂</span>
            <span>Sous-catégorie</span>
          </button>

          <button
            onClick={() => onNewNote(selectedSubcategory)}
            className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-[#e6edf3] hover:bg-[#d0d7de] text-[#0d1117] rounded-md text-sm font-medium transition-colors"
          >
            <span className="text-lg">+</span>
            <span>Pense-Bête</span>
          </button>
        </div>
      </div>

      {/* Menu Paramètres flottant */}
      <div className="fixed top-6 right-4 z-[1000]">
       <Menu as="div" className="relative inline-block text-left">
          {({ close }) => (
            <>
              <MenuButton className="cursor-pointer text-[var(--primary)] hover:text-[#7d8590] p-2 rounded-full bg-[var(--button)] hover:bg-[var(--hover)] transition-colors" aria-label="Menu paramètres">
                {/* SVG engrenage */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path d="M19.14,12.936a7.963,7.963,0,0,0,.06-.936,7.963,7.963,0,0,0-.06-.936l2.11-1.65a.5.5,0,0,0,.12-.64l-2-3.464a.5.5,0,0,0-.6-.22l-2.49,1a7.994,7.994,0,0,0-1.62-.936l-.38-2.65A.5.5,0,0,0,13.75,2h-3.5a.5.5,0,0,0-.49.42l-.38,2.65a7.994,7.994,0,0,0-1.62.936l-2.49-1a.5.5,0,0,0-.6.22l-2,3.464a.5.5,0,0,0,.12.64l2.11,1.65a7.963,7.963,0,0,0-.06.936,7.963,7.963,0,0,0,.06.936l-2.11,1.65a.5.5,0,0,0-.12.64l2,3.464a.5.5,0,0,0,.6.22l2.49-1a7.994,7.994,0,0,0,1.62.936l.38,2.65a.5.5,0,0,0,.49.42h3.5a.5.5,0,0,0,.49-.42l.38-2.65a7.994,7.994,0,0,0,1.62-.936l2.49,1a.5.5,0,0,0,.6-.22l2-3.464a.5.5,0,0,0-.12-.64Zm-7.14,2.064A3,3,0,1,1,15,12,3,3,0,0,1,12,15Z" />
                </svg>
              </MenuButton>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="min-w-[200px] absolute right-0 mt-2 w-40 bg-[var(--background)] border border-[#30363d] rounded-md shadow-lg focus:outline-none z-50">
                  <div className="px-1 py-1">
                    <HeaderMenu onClose={close} openDeleteModal={() => setIsModalOpen(true)}/>
                  </div>
                </MenuItems>
              </Transition>
            </>
          )}
        </Menu>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteAccount}
          title="Confirmer la suppression"
          description="Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues."
          confirmText="Supprimer"
          cancelText="Annuler"
          confirmVariant="danger"
          loading={loading}
        />
      </div>
    </header>
  )
}
