'use client'

import { memo } from 'react'
import MenuActions from '@/components/MenuActions'
import { Note, Snippet, Category } from '@/lib/types'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import NoteEditCard from './NoteEditCard'

type NoteCardProps = {
  note: Note
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
  hideSnippets?: boolean
}

function NoteCard({
  note,
  categories,
  editingNoteId,
  editingNoteTitle,
  editingNoteDescription,
  editingNoteSubcategoryId,
  editingNoteSnippets,
  copiedSnippetId,
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
  copyToClipboard,
  hideSnippets = false,
}: NoteCardProps) {
  const isEditing = editingNoteId === note.id
  
  if (isEditing) {
    return (
      <NoteEditCard
        note={note}
        categories={categories}
        editingNoteTitle={editingNoteTitle}
        editingNoteDescription={editingNoteDescription}
        editingNoteSubcategoryId={editingNoteSubcategoryId}
        editingNoteSnippets={editingNoteSnippets}
        setEditingNoteTitle={setEditingNoteTitle}
        setEditingNoteDescription={setEditingNoteDescription}
        setEditingNoteSubcategoryId={setEditingNoteSubcategoryId}
        addEditingSnippet={addEditingSnippet}
        updateEditingSnippet={updateEditingSnippet}
        removeEditingSnippet={removeEditingSnippet}
        saveNote={saveNote}
        setEditingNoteId={setEditingNoteId}
      />
    )
  }

  // Vue normale
  return (
    <div className="bg-[var(--background)] border border-[#30363d] rounded-md overflow-hidden">
      <div className="p-4 border-b border-[#30363d]">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-[#58a6ff] mb-2">{note.title}</h3>
          <MenuActions
            onEdit={() => startEditingNote(note)}
            onDelete={() => deleteNote(note.id)}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-[#7d8590] mb-2">
          <span>{note.subcategory.category.name}</span> › <span>{note.subcategory.name}</span>
        </div>
        <p className="text-[var(--primary)]">{note.description}</p>
        
        {/* Ne render les snippets que si hideSnippets est false */}
        {!hideSnippets && note?.snippets?.length > 0 && (
          <div className="space-y-3 p-4">
            {note.snippets.map((snippet, idx) => (
              <div key={snippet.id || idx} className="relative">
                <div className="flex items-center justify-between bg-[var(--button)] px-4 py-2 rounded-t-md border border-[#30363d] border-b-0">
                  <span className="text-xs font-mono text-[#7d8590]">{snippet.language}</span>
                  <button
                    onClick={() => copyToClipboard(snippet.code, snippet.id || `${note.id}-${idx}`)}
                    className={`cursor-pointer px-2 py-1 text-xs rounded transition-colors ${
                      copiedSnippetId === (snippet.id || `${note.id}-${idx}`)
                        ? 'bg-[#d0d7de] text-[#0d1117] font-medium'
                        : 'bg-[#e6edf3] text-[#0d1117] hover:bg-[#d0d7de]'
                    }`}
                  >
                    {copiedSnippetId === (snippet.id || `${note.id}-${idx}`) ? '✓ Copié !' : 'Copier'}
                  </button>
                </div>
                <SyntaxHighlighter
                  language={snippet.language}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0 0 6px 6px',
                    border: '1px solid #30363d',
                    fontSize: '13px',
                    maxHeight: '450px',
                    overflow: 'auto',
                  }}
                >
                  {snippet.code}
                </SyntaxHighlighter>
              </div>
            ))}
          </div>
        )}
        
        {/* Si snippets cachés, afficher un placeholder */}
        {hideSnippets && note?.snippets?.length > 0 && (
          <div className="mt-4 p-3 bg-[var(--button)] rounded border border-[#30363d] text-center text-[#7d8590] text-sm">
            {note.snippets.length} snippet{note.snippets.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}

// Mémoize le composant
export default memo(NoteCard, (prev, next) => {
  return (
    prev.note.id === next.note.id &&
    prev.editingNoteId === next.editingNoteId &&
    prev.editingNoteTitle === next.editingNoteTitle &&
    prev.editingNoteDescription === next.editingNoteDescription &&
    prev.editingNoteSubcategoryId === next.editingNoteSubcategoryId &&
    prev.copiedSnippetId === next.copiedSnippetId &&
    prev.hideSnippets === next.hideSnippets &&
    prev.editingNoteSnippets === next.editingNoteSnippets
  )
})
