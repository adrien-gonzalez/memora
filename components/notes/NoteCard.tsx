'use client'

import { memo } from 'react'
import MenuActions from '@/components/MenuActions'
import { Note, Snippet, Category } from '@/lib/types'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'

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
      <div className="bg-[var(--background)] border border-[#30363d] rounded-md overflow-hidden">
        <div className="p-4 border-b border-[#30363d] space-y-4">
          <Input
            value={editingNoteTitle}
            onChange={e => setEditingNoteTitle(e.target.value)}
            className="w-full px-2 py-1 bg-[var(--background)] border border-[#30363d] rounded text-sm"
            placeholder="Titre"
          />

          <Textarea
            value={editingNoteDescription}
            onChange={e => setEditingNoteDescription(e.target.value)}
            rows={3}
            className="w-full px-2 py-1 bg-[var(--background)] border border-[#30363d] rounded text-sm"
            placeholder="Description (optionnel)"
          />
          <select
            value={editingNoteSubcategoryId}
            onChange={e => setEditingNoteSubcategoryId(e.target.value)}
            className="px-2 py-1 bg-[var(--background)] border border-[#30363d] rounded text-sm"
          >
            {categories.flatMap(c =>
              c.subcategories.map(s => (
                <option key={s.id} value={s.id}>{c.name} › {s.name}</option>
              ))
            )}
          </select>

          {/* Snippets */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Snippets</span>
              <button
                onClick={addEditingSnippet}
                className="cursor-pointer text-black px-3 py-1 text-sm bg-[#e6edf3] hover:bg-[#d0d7de] rounded"
              >
                + Ajouter
              </button>
            </div>
            <div className="space-y-4">
              {editingNoteSnippets.map((snippet, idx) => (
                <div key={snippet.id || idx} className="border border-[#30363d] rounded-md p-3">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <select
                      value={snippet.language}
                      onChange={e => updateEditingSnippet(idx, 'language', e.target.value)}
                      className="px-2 py-1 bg-[var(--background)] border border-[#30363d] rounded text-sm"
                    >
                      <option value="bash">Bash</option>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="css">CSS</option>
                      <option value="html">HTML</option>
                      <option value="sql">SQL</option>
                      <option value="json">JSON</option>
                    </select>
                    <button
                      onClick={() => removeEditingSnippet(idx)}
                      className="cursor-pointer text-red-500 text-sm hover:text-red-400"
                    >
                      Supprimer
                    </button>
                  </div>
                  <Textarea
                      value={snippet.code}
                      onChange={e => updateEditingSnippet(idx, 'code', e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[#30363d] rounded-md font-mono text-sm"
                      placeholder="Code (optionnel)"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button onClick={() => saveNote(note.id)} className="cursor-pointer px-4 py-2 bg-[#d0d7de] rounded-md text-black">Sauvegarder</button>
            <button onClick={() => setEditingNoteId(null)} className="text-white cursor-pointer px-4 py-2 bg-red-600 rounded-md">Annuler</button>
          </div>
        </div>
      </div>
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
