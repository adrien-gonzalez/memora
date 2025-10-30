'use client'

import { 
  DndContext, 
  closestCenter, 
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable'
import { useState, useMemo } from 'react'
import SortableNote from './SortableNote'
import { Note, Category } from '@/lib/types'
import { useNotes } from '@/hooks/useNotes'

type NoteListProps = {
  notes: Note[]
  categories: Category[]
}

export default function NoteList({ notes, categories }: NoteListProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  
  // Sensor optimisé
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )
  
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
  } = useNotes()

  const notesArray = Array.isArray(notes) ? notes : []
  const activeNote = useMemo(
    () => activeId ? notesArray.find(n => n.id === activeId) : null,
    [activeId, notesArray]
  )

  // Early return APRÈS tous les hooks
  if (notes.length === 0) {
    return (
      <div className="bg-[var(--background)] border border-[#30363d] rounded-md p-8 text-center">
        <p className="text-[#7d8590]">Aucun pense-bête pour le moment</p>
      </div>
    )
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    
    if (!over || active.id === over.id) return

    const oldIndex = notes.findIndex(n => n.id === active.id)
    const newIndex = notes.findIndex(n => n.id === over.id)

    const newNotes = [...notes]
    const [movedNote] = newNotes.splice(oldIndex, 1)
    newNotes.splice(newIndex, 0, movedNote)

    saveNoteOrder(newNotes)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  return (
    <div className="space-y-4">
      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        collisionDetection={closestCenter}
      >
        <SortableContext items={notesArray.map(n => n.id)} strategy={verticalListSortingStrategy}>
          {notesArray.map((note, idx) => (
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
              isDragging={note.id === activeId}
            />
          ))}
        </SortableContext>
        
        {/* Overlay simplifié avec will-change pour la perf */}
        <DragOverlay 
          dropAnimation={null}
          style={{ 
            willChange: 'transform',
          }}
        >
          {activeNote ? (
            <div 
              className="cursor-grabbing"
              style={{
                // Force hardware acceleration
                transform: 'translate3d(0, 0, 0)',
                willChange: 'transform',
              }}
            >
              <SortableNote
                note={activeNote}
                index={0}
                categories={categories}
                editingNoteId={null} // Désactive l'édition pendant le drag
                editingNoteTitle=""
                editingNoteDescription=""
                editingNoteSubcategoryId=""
                editingNoteSnippets={[]}
                copiedSnippetId={null}
                startEditingNote={() => {}}
                deleteNote={() => {}}
                setEditingNoteTitle={() => {}}
                setEditingNoteDescription={() => {}}
                setEditingNoteSubcategoryId={() => {}}
                addEditingSnippet={() => {}}
                updateEditingSnippet={() => {}}
                removeEditingSnippet={() => {}}
                saveNote={() => {}}
                setEditingNoteId={() => {}}
                copyToClipboard={() => {}}
                isOverlay
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}