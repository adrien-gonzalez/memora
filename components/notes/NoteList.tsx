'use client'

import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableNote from './SortableNote'
import { Note, Category } from '@/lib/types'
import { useNotes } from '@/hooks/useNotes'

type NoteListProps = {
  notes: Note[]
  categories: Category[]
}

export default function NoteList({ notes, categories }: NoteListProps) {
  const {
    editingNoteId,
    editingNoteTitle,
    editingNoteDescription,
    editingNoteSubcategoryId,
    editingNoteSnippets,
    startEditingNote,
    deleteNote,
    setEditingNoteTitle,
    setEditingNoteDescription,
    setEditingNoteSubcategoryId,
    addEditingSnippet,
    updateEditingSnippet,
    removeEditingSnippet,
    saveNote,
    setEditingNoteId,
    copiedSnippetId,
    copyToClipboard,
    saveNoteOrder,
  } = useNotes() // ✅ récupérer tous les states et actions

  if (notes.length === 0) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-md p-8 text-center">
        <p className="text-[#7d8590]">Aucun pense-bête pour le moment</p>
      </div>
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = notes.findIndex(n => n.id === active.id)
    const newIndex = notes.findIndex(n => n.id === over.id)

    const newNotes = [...notes]
    const [movedNote] = newNotes.splice(oldIndex, 1)
    newNotes.splice(newIndex, 0, movedNote)

    saveNoteOrder(newNotes)
  }

  const notesArray = Array.isArray(notes) ? notes : []

  return (
    <div className="space-y-4">
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableContext items={notesArray.map(n => n.id)} strategy={verticalListSortingStrategy}>
          {notesArray?.map((note, idx) => (
            <SortableNote
              key={note.id}
              note={note}
              index={idx}
              categories={categories}
              editingNoteId={editingNoteId}
              editingNoteTitle={editingNoteTitle}
              editingNoteDescription={editingNoteDescription}
              editingNoteSubcategoryId={editingNoteSubcategoryId}
              editingNoteSnippets={editingNoteSnippets}
              copiedSnippetId={copiedSnippetId}
              startEditingNote={startEditingNote}
              deleteNote={deleteNote}
              setEditingNoteTitle={setEditingNoteTitle}
              setEditingNoteDescription={setEditingNoteDescription}
              setEditingNoteSubcategoryId={setEditingNoteSubcategoryId}
              addEditingSnippet={addEditingSnippet}
              updateEditingSnippet={updateEditingSnippet}
              removeEditingSnippet={removeEditingSnippet}
              saveNote={saveNote}
              setEditingNoteId={setEditingNoteId}
              copyToClipboard={copyToClipboard}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
