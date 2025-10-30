'use client'

import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import NoteCard from './NoteCard'
import { Note, Category, Snippet } from '@/lib/types'

type SortableNoteProps = {
  note: Note
  index: number
  categories: Category[]
  editingNoteId: string | null
  editingNoteTitle: string
  editingNoteDescription: string
  editingNoteSubcategoryId: string
  editingNoteSnippets: Snippet[]
  copiedSnippetId: string | null
  startEditingNote: (note: Note) => void
  deleteNote: (id: string) => void
  setEditingNoteTitle: (title: string) => void
  setEditingNoteDescription: (desc: string) => void
  setEditingNoteSubcategoryId: (id: string) => void
  addEditingSnippet: () => void
  updateEditingSnippet: (idx: number, field: 'language' | 'code', value: string) => void
  removeEditingSnippet: (idx: number) => void
  saveNote: (id: string) => void
  setEditingNoteId: (id: string | null) => void
  copyToClipboard: (code: string, id: string) => void
}

export default function SortableNote(props: SortableNoteProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.note.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 cursor-grab text-gray-400 hover:text-gray-200 z-10 select-none"
      >
        ⠿
      </div>

      <NoteCard {...props} />
    </div>
  )
}
