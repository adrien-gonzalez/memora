'use client'

import { Fragment, ReactNode } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild, Description } from '@headlessui/react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  description?: string
  children?: ReactNode
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'danger' | 'primary'
  loading?: boolean
  showCancel?: boolean
  showConfirm?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  children,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmVariant = 'primary',
  loading = false,
  showCancel = true,
  showConfirm = true,
}: ModalProps) {
  const confirmButtonClass =
    confirmVariant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white'

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="bg-[var(--background)] border border-[#30363d] rounded-md p-6 max-w-sm w-full shadow-xl">
              <DialogTitle className="text-lg font-semibold mb-4 text-[var(--primary)]">
                {title}
              </DialogTitle>

              {description && (
                <Description className="mb-6 text-sm text-[var(--secondary)]">
                  {description}
                </Description>
              )}

              {children && <div className="mb-6">{children}</div>}

              <div className="flex justify-end gap-3">
                {showCancel && (
                  <button
                    onClick={onClose}
                    className="cursor-pointer px-4 py-2 rounded-md border border-[#30363d] bg-[var(--button)] hover:bg-[var(--hover)] transition-colors text-sm font-medium"
                    disabled={loading}
                  >
                    {cancelText}
                  </button>
                )}

                {showConfirm && onConfirm && (
                  <button
                    onClick={onConfirm}
                    className={`cursor-pointer px-4 py-2 rounded-md ${confirmButtonClass} transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={loading}
                  >
                    {loading ? 'Chargement...' : confirmText}
                  </button>
                )}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}