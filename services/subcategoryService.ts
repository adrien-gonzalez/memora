import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { Subcategory } from '@/lib/types'

export async function fetchSubcategories(): Promise<Subcategory[]> {
  return fetchWithAuth('/api/subcategories')
}

export async function createSubcategory(sub: { name: string; description: string; categoryId: string }): Promise<Subcategory> {
  return fetchWithAuth('/api/subcategories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sub),
  })
}

export async function updateSubcategory(id: string, data: { name: string; description: string; categoryId: string }): Promise<Subcategory> {
  return fetchWithAuth(`/api/subcategories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteSubcategory(id: string): Promise<void> {
  return fetchWithAuth(`/api/subcategories/${id}`, { method: 'DELETE' })
}
