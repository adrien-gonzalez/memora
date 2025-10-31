'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Category } from '@/lib/types'
import * as categoryService from '@/services/categoryService'
import { getDecodeToken } from '@/lib/clientAuth'
import { toast } from 'sonner'

type NewCategory = { name: string; description: string }

export function useCategories() {
  const queryClient = useQueryClient()
  const userId = getDecodeToken()

  // --- Fetch categories ---
  const { data: categories = [], isLoading, isError } = useQuery<Category[]>({
    queryKey: ['categories', userId],
    queryFn: categoryService.fetchCategories,
    staleTime: 1000 * 60 * 5,  // 5 minutes
    refetchOnWindowFocus: false,
  })

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: (newCat: NewCategory) => categoryService.createCategory(newCat),
    onSuccess: () => {
      // Invalidate cache pour refetch automatique
      queryClient.invalidateQueries({ queryKey: ['categories', userId] })
    },
    onError: (error: any) => {
      toast.error("Échec de la création de la catégorie", {
        description:
          error?.response?.data?.message ??
          "Une erreur est survenue lors de la création. Veuillez réessayer.",
      });
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: NewCategory }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', userId] })
    },
    onError: (error: any) => {
      toast.error("Échec de la mise à jour de la catégorie", {
        description:
          error?.response?.data?.message ??
          "Impossible de mettre à jour cette catégorie.",
      });
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', userId] })
    },
    onError: (error: any) => {
      toast.error("Échec de la suppression de la catégorie", {
        description:
          error?.response?.data?.message ??
          "Impossible de supprimer cette catégorie.",
      });
    },
  })

  // --- Local state form / editing ---
  const [newCategory, setNewCategory] = useState<NewCategory>({ name: '', description: '' })
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [editingCategoryDescription, setEditingCategoryDescription] = useState('')

  // --- Actions ---
  const createCategory = async () => {
    if (!newCategory.name) {
      toast.error("Veuillez remplir tous les champs", {
        description: "Indiquez un nom pour cette catégorie.",
      });
      return;
    }
    await createMutation.mutateAsync(newCategory)
    setNewCategory({ name: '', description: '' })
  }

  const saveCategory = async () => {
    if (!editingCategoryId) return
    await updateMutation.mutateAsync({
      id: editingCategoryId,
      data: { name: editingCategoryName, description: editingCategoryDescription },
    })
    setEditingCategoryId(null)
  }

  const deleteCategory = async (id: string) => {
    await deleteMutation.mutateAsync(id)
  }

  return {
    categories,
    isLoading,
    isError,
    newCategory,
    setNewCategory,
    editingCategoryId,
    editingCategoryName,
    editingCategoryDescription,
    setEditingCategoryId,
    setEditingCategoryName,
    setEditingCategoryDescription,
    createCategory,
    saveCategory,
    deleteCategory,
  }
}
