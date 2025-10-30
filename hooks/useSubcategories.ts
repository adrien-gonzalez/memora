'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { NewSubcategory, Subcategory, UpdateSubcategoryData } from '@/lib/types'
import * as subcategoryService from '@/services/subcategoryService'
import { getDecodeToken } from '@/lib/clientAuth'

export function useSubcategories() {
  const queryClient = useQueryClient()
  const userId = getDecodeToken()

  // --- Fetch subcategories ---
  const { data: subcategories = [], isLoading, isError } = useQuery<Subcategory[]>({
    queryKey: ['subcategories', userId],
    queryFn: subcategoryService.fetchSubcategories,
    staleTime: 1000 * 60 * 5,  // 5 min
    refetchOnWindowFocus: false,
  })

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: (newSub: NewSubcategory) =>
      subcategoryService.createSubcategory(newSub),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories', userId] })
      queryClient.invalidateQueries({ queryKey: ['categories', userId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubcategoryData }) =>
      subcategoryService.updateSubcategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subcategories', userId] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => subcategoryService.deleteSubcategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories', userId] })
      queryClient.invalidateQueries({ queryKey: ['categories', userId] })
    },

  })

  // --- Local state form / editing ---
  const [newSubcategory, setNewSubcategory] = useState<NewSubcategory>({ name: '', description: '', categoryId: '' })
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null)
  const [editingSubcategoryName, setEditingSubcategoryName] = useState('')
  const [editingSubcategoryDescription, setEditingSubcategoryDescription] = useState('')
  const [editingSubcategoryCategoryId, setEditingSubcategoryCategoryId] = useState('')

  // --- Actions ---
  const createSubcategory = async () => {
    if (!newSubcategory.name || !newSubcategory.categoryId) return
    await createMutation.mutateAsync(newSubcategory)
    setNewSubcategory({ name: '', description: '', categoryId: '' })
  }

  const saveSubcategory = async () => {
    if (!editingSubcategoryId) return
    await updateMutation.mutateAsync({
      id: editingSubcategoryId,
      data: {
        name: editingSubcategoryName,
        description: editingSubcategoryDescription,
        categoryId: editingSubcategoryCategoryId, // ← obligatoire
      },
    })
    setEditingSubcategoryId(null)
  }

  const deleteSubcategory = async (id: string) => {
    await deleteMutation.mutateAsync(id)
  }


  return {
    subcategories,
    isLoading,
    isError,
    newSubcategory,
    setNewSubcategory,
    editingSubcategoryId,
    editingSubcategoryName,
    editingSubcategoryDescription,
    editingSubcategoryCategoryId,
    setEditingSubcategoryId,
    setEditingSubcategoryName,
    setEditingSubcategoryDescription,
    setEditingSubcategoryCategoryId,
    createSubcategory,
    saveSubcategory,
    deleteSubcategory,
  }
}
