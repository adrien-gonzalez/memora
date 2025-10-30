import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { Category } from '@/lib/types'

export async function fetchCategories(): Promise<Category[]> {
  return fetchWithAuth('/api/categories')
}

export async function createCategory(category: { name: string; description: string }): Promise<Category> {
  return fetchWithAuth('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  })
}

export async function updateCategory(id: string, data: { name: string; description: string }): Promise<Category> {
  return fetchWithAuth(`/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteCategory(id: string): Promise<void> {
  return fetchWithAuth(`/api/categories/${id}`, { method: 'DELETE' })
}
