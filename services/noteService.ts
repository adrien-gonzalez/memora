import { fetchWithAuth } from '@/lib/fetchWithAuth'
import { Note, UpdateNoteOrderData } from '@/lib/types'

export async function fetchNotes(subcategoryId?: string): Promise<Note[]> {
  const url = subcategoryId ? `/api/notes?subcategoryId=${subcategoryId}` : '/api/notes'
  return fetchWithAuth(url)
}

export async function createNote(note: any): Promise<Note> {
  return fetchWithAuth('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  })
}

export async function updateNote(id: string, note: any): Promise<Note> {
  return fetchWithAuth(`/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  })
}

export async function updateNoteOrder(id: string, data: UpdateNoteOrderData): Promise<Note> {
  return fetchWithAuth(`/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteNote(id: string): Promise<void> {
  return fetchWithAuth(`/api/notes/${id}`, { method: 'DELETE' })
}
