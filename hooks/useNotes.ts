'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateNoteData, Note, Snippet } from '@/lib/types'
import * as noteService from '@/services/noteService'
import { getDecodeToken } from '@/lib/clientAuth'

export function useNotes(selectedSubcategory?: string) {
  const queryClient = useQueryClient()
  const userId = getDecodeToken()

  // --- Fetch notes ---
  const { data: notes = [], isLoading, isError } = useQuery<Note[]>({
    queryKey: ['notes', selectedSubcategory || 'all', userId],
    queryFn: () => noteService.fetchNotes(selectedSubcategory),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: (newNote: CreateNoteData) => noteService.createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', selectedSubcategory || 'all', userId] })
      queryClient.invalidateQueries({ queryKey: ['categories', userId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Note> }) =>
      noteService.updateNote(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes', selectedSubcategory || 'all', userId] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => noteService.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', selectedSubcategory || 'all', userId] }),
      queryClient.invalidateQueries({ queryKey: ['categories', userId] })
    },
  })

  // --- Local states ---
  const [view, setView] = useState<'notes' | 'newNote' | 'newCategory' | 'newSubcategory'>('notes')
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null)

  const [newNote, setNewNote] = useState({
    title: '',
    description: '',
    subcategoryId: selectedSubcategory || '',
    snippets: [] as Snippet[],
  })

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingNoteTitle, setEditingNoteTitle] = useState('')
  const [editingNoteDescription, setEditingNoteDescription] = useState('')
  const [editingNoteSubcategoryId, setEditingNoteSubcategoryId] = useState('')
  const [editingNoteSnippets, setEditingNoteSnippets] = useState<Snippet[]>([])

  // --- Actions ---
  const createNote = async () => {
    if (!newNote.subcategoryId) return
    await createMutation.mutateAsync({
      title: newNote.title,
      description: newNote.description,
      subcategoryId: newNote.subcategoryId,
      snippets: (newNote.snippets || []).map((s, idx) => ({ ...s, order: idx })),
    })
    setNewNote({ title: '', description: '', subcategoryId: selectedSubcategory || '', snippets: [] })
    setView('notes')
  }

  const startEditingNote = (note: Note) => {
    setEditingNoteId(note.id)
    setEditingNoteTitle(note.title)
    setEditingNoteDescription(note.description)
    setEditingNoteSubcategoryId(note.subcategory.id)
    setEditingNoteSnippets(note.snippets.map(s => ({ ...s }))) // IMPORTANT: garder id existants
  }

  const saveNote = async () => {
    if (!editingNoteId) return
    await updateMutation.mutateAsync({
      id: editingNoteId,
      data: {
        title: editingNoteTitle,
        description: editingNoteDescription,
        snippets: editingNoteSnippets.map((s, idx) => ({
          id: s.id,        // garder id pour update
          code: s.code,
          language: s.language,
          order: idx,      // nouveau order
        })),
      },
    })
    setEditingNoteId(null)
  }

  const deleteNote = async (id: string) => await deleteMutation.mutateAsync(id)

  // --- Snippets ---
  const addSnippet = () => setNewNote({ ...newNote, snippets: [...newNote.snippets, { code: '', language: 'bash', order: newNote?.snippets?.length }] })
  const updateSnippet = (index: number, field: 'code' | 'language', value: string) => {
    const updated = [...newNote.snippets]
    updated[index] = { ...updated[index], [field]: value }
    setNewNote({ ...newNote, snippets: updated })
  }
  const removeSnippet = (index: number) => setNewNote({ ...newNote, snippets: newNote.snippets.filter((_, i) => i !== index) })

  const addEditingSnippet = () => setEditingNoteSnippets([...editingNoteSnippets, { code: '', language: 'bash', order: editingNoteSnippets.length }])
  const updateEditingSnippet = (index: number, field: 'code' | 'language', value: string) => {
    const updated = [...editingNoteSnippets]
    updated[index] = { ...updated[index], [field]: value }
    setEditingNoteSnippets(updated)
  }
  const removeEditingSnippet = (index: number) => setEditingNoteSnippets(editingNoteSnippets.filter((_, i) => i !== index))

  const copyToClipboard = (text: string, snippetId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSnippetId(snippetId)
    setTimeout(() => setCopiedSnippetId(null), 2000)
  }

  const initNewNote = () => {
    setView('newNote')
    setNewNote({ title: '', description: '', subcategoryId: selectedSubcategory || '', snippets: [] })
  }

  // --- Réordonner les notes ---
  const saveNoteOrder = async (orderedNotes: Note[]) => {
    queryClient.setQueryData<Note[]>(['notes', selectedSubcategory || 'all'], orderedNotes)

    await Promise.all(
      orderedNotes.map((note, idx) =>
        noteService.updateNoteOrder(note.id, { order: idx }) // API spéciale pour ordre
      )
    )

    queryClient.invalidateQueries({ queryKey: ['notes', selectedSubcategory || 'all', userId] })
  }

  return {
    notes,
    isLoading,
    isError,
    view,
    setView,
    copiedSnippetId,
    newNote,
    setNewNote,
    editingNoteId,
    editingNoteTitle,
    editingNoteDescription,
    editingNoteSubcategoryId,
    editingNoteSnippets,
    setEditingNoteId,
    setEditingNoteTitle,
    setEditingNoteDescription,
    setEditingNoteSubcategoryId,
    setEditingNoteSnippets,
    fetchNotes: () => queryClient.invalidateQueries({ queryKey: ['notes', selectedSubcategory || 'all'] }),
    createNote,
    startEditingNote,
    saveNote,
    saveNoteOrder,
    deleteNote,
    addSnippet,
    updateSnippet,
    removeSnippet,
    addEditingSnippet,
    updateEditingSnippet,
    removeEditingSnippet,
    copyToClipboard,
    initNewNote,
  }
}
