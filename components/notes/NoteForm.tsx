// components/notes/NoteForm.tsx
'use client'

import { Category, Snippet } from '@/lib/types'
import { Dispatch, SetStateAction } from 'react'

type NoteFormProps = {
  categories: Category[]
  note: {
    title: string
    description: string
    subcategoryId: string
    snippets: Snippet[]
  }
  setNote: Dispatch<SetStateAction<{
    title: string
    description: string
    subcategoryId: string
    snippets: Snippet[]
  }>>
  createNote: () => void
  addSnippet: () => void
  updateSnippet: (index: number, field: 'code' | 'language', value: string) => void
  removeSnippet: (index: number) => void
  onCancel: () => void
}

export default function NoteForm({
  categories,
  note,
  setNote,
  createNote,
  addSnippet,
  updateSnippet,
  removeSnippet,
  onCancel,
}: NoteFormProps) {

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6">
      <h2 className="text-xl font-semibold mb-4">Nouveau Pense-Bête</h2>

      <select
        value={note.subcategoryId}
        onChange={e => setNote({ ...note, subcategoryId: e.target.value })}
        className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md mb-2"
      >
        <option value="">Sélectionner une sous-catégorie</option>
        {categories.flatMap(c =>
          c.subcategories.map(s => (
            <option key={s.id} value={s.id}>
              {c.name} › {s.name}
            </option>
          ))
        )}
      </select>

      <input
        type="text"
        value={note.title}
        onChange={e => setNote({ ...note, title: e.target.value })}
        placeholder="Titre"
        className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md mb-2"
      />

      <textarea
        value={note.description}
        onChange={e => setNote({ ...note, description: e.target.value })}
        placeholder="Description"
        rows={4}
        className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md mb-2"
      />

      {/* Snippets */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Snippets de code</label>
          <button onClick={addSnippet} className="cursor-pointer px-3 py-1 text-sm bg-[#e6edf3] hover:bg-[#d0d7de] text-black rounded">
            + Ajouter un snippet
          </button>
        </div>

        {note.snippets.map((snippet, idx) => (
          <div key={idx} className="border border-[#30363d] rounded-md p-4 mb-2">
            <div className="flex items-center justify-between mb-2">
              <select
                value={snippet.language}
                onChange={e => updateSnippet(idx, 'language', e.target.value)}
                className="px-2 py-1 bg-[#0d1117] border border-[#30363d] rounded"
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
                onClick={() => removeSnippet(idx)}
                className="cursor-pointer text-red-500 text-sm hover:text-red-400"
              >
                Supprimer
              </button>
            </div>

            <textarea
              value={snippet.code}
              onChange={e => updateSnippet(idx, 'code', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md font-mono text-sm"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={createNote} className="hover:bg-[#d0d7de] cursor-pointer px-4 py-2 bg-[#e6edf3] rounded-md text-black">
          Créer
        </button>
        <button onClick={onCancel} className="cursor-pointer px-4 py-2 bg-[#21262d] rounded-md">
          Annuler
        </button>
      </div>
    </div>
  )
}
