'use client'

import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { memo } from 'react'
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
  isDragging?: boolean
  isOverlay?: boolean
  hideSnippets?: boolean
}

function SortableNote(props: SortableNoteProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
  } = useSortable({ 
    id: props.note.id,
    transition: {
      duration: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: props.isDragging && !props.isOverlay ? 0.4 : 1,
    // Force hardware acceleration
    ...(props.isOverlay && {
      transform: 'translate3d(0, 0, 0)',
      willChange: 'transform',
    })
  }

  const dragHandleProps = props.isOverlay ? {} : { ...attributes, ...listeners }

  return (
    <div ref={props.isOverlay ? undefined : setNodeRef} style={style} className="relative">
      {/* Drag handle - caché en mode overlay */}
      {!props.isOverlay && (
        <div
          {...dragHandleProps}
          className="absolute top-2 right-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-200 z-10 select-none"
        >
          ⠿
        </div>
      )}

      <NoteCard {...props} hideSnippets={props.hideSnippets} />
    </div>
  )
}

// Mémoize pour éviter les re-renders inutiles
export default memo(SortableNote, (prev, next) => {
  // Re-render seulement si ces props changent
  return (
    prev.note.id === next.note.id &&
    prev.isDragging === next.isDragging &&
    prev.isOverlay === next.isOverlay &&
    prev.editingNoteId === next.editingNoteId &&
    prev.copiedSnippetId === next.copiedSnippetId
  )
})