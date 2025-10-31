'use client'

import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Edit2, Trash2 } from 'lucide-react'

type MenuActionsProps = {
  onEdit: () => void
  onDelete: () => void
}

export default function MenuActions({ onEdit, onDelete }: MenuActionsProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ close }) => (
        <>
          <Menu.Button className="cursor-pointer px-2 py-1 text-sm hover:bg-[var(--button)] rounded transition-colors">
            ⋮
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-32 bg-[var(--background)] border border-[#30363d] rounded-md shadow-lg focus:outline-none z-[9999]">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        close()
                        onEdit()
                      }}
                      className={`cursor-pointer w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-2 ${
                        active ? 'bg-[#e6edf3] text-black' : ''
                      }`}
                    >
                      <Edit2 size={14} />
                      <span>Modifier</span>
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        close()
                        onDelete()
                      }}
                      className={`cursor-pointer w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-2 ${
                        active ? 'bg-red-600 text-white' : ''
                      }`}
                    >
                      <Trash2 size={14} />
                      <span>Supprimer</span>
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}