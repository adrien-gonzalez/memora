'use client'

import { Note, Snippet, Category } from '@/lib/types'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'

type NoteEditCardProps = {
  note: Note
  categories: Category[]
  editingNoteTitle: string
  editingNoteDescription: string
  editingNoteSubcategoryId: string
  editingNoteSnippets: Snippet[]
  setEditingNoteTitle: (title: string) => void
  setEditingNoteDescription: (desc: string) => void
  setEditingNoteSubcategoryId: (id: string) => void
  addEditingSnippet: () => void
  updateEditingSnippet: (idx: number, field: 'language' | 'code', value: string) => void
  removeEditingSnippet: (idx: number) => void
  saveNote: (id: string) => void
  setEditingNoteId: (id: string | null) => void
}

function NoteEditCard({
  note,
  categories,
  editingNoteTitle,
  editingNoteDescription,
  editingNoteSubcategoryId,
  editingNoteSnippets,
  setEditingNoteTitle,
  setEditingNoteDescription,
  setEditingNoteSubcategoryId,
  addEditingSnippet,
  updateEditingSnippet,
  removeEditingSnippet,
  saveNote,
  setEditingNoteId,
}: NoteEditCardProps) {
   return (
      <div className="bg-[var(--background)] border border-[#30363d] rounded-md overflow-hidden">
        <div className="p-6 border-b border-[#30363d] space-y-4">
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

export default NoteEditCard;
