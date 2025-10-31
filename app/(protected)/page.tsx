'use client'

import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import NoteList from '@/components/notes/NoteList'
import NoteForm from '@/components/notes/NoteForm'

import { useCategories } from '@/hooks/useCategories'
import { useSubcategories } from '@/hooks/useSubcategories'
import { useNotes } from '@/hooks/useNotes'
import { useState } from 'react'
import CategoryForm from '@/components/categories/CategoryForm'
import SubcategoryForm from '@/components/categories/SubcategoryForm'


export default function Home() {
  
  const {
    categories,
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
    deleteCategory
  } = useCategories()


  const {
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
    deleteSubcategory
  } = useSubcategories()

  const {
    notes,
    view,
    setView,
    newNote,
    setNewNote,
    fetchNotes,
    createNote,
    addSnippet,
    updateSnippet,
    removeSnippet,
    initNewNote,
  } = useNotes()

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined)
  const handleSelectSubcategory = (subcatId: string) => {
    setSelectedSubcategory(subcatId)
    fetchNotes()
  }

  return (
    <div>
      <Header
        selectedSubcategory={selectedSubcategory ?? undefined}
        onNewCategory={() => setView('newCategory')}
        onNewSubcategory={() => setView('newSubcategory')}
        onNewNote={initNewNote}
      />

      <div className="max-w-7xl mx-auto pt-6 flex gap-6">
        <Sidebar
          categories={categories}
          selectedSubcategory={selectedSubcategory ?? null}
          editingCategoryId={editingCategoryId}
          editingCategoryName={editingCategoryName}
          editingCategoryDescription={editingCategoryDescription}
          editingSubcategoryId={editingSubcategoryId}
          editingSubcategoryName={editingSubcategoryName}
          editingSubcategoryDescription={editingSubcategoryDescription}
          editingSubcategoryCategoryId={editingSubcategoryCategoryId}

          onSelectAllNotes={() => { setSelectedSubcategory(undefined); fetchNotes() }}
          onSelectSubcategory={handleSelectSubcategory}

          onEditCategory={(id, name, desc) => {
            setEditingCategoryId(id)
            setEditingCategoryName(name)
            setEditingCategoryDescription(desc)
          }}
          onChangeCategoryName={setEditingCategoryName}
          onChangeCategoryDescription={setEditingCategoryDescription}
          onSaveCategory={saveCategory}
          onCancelEditCategory={() => setEditingCategoryId(null)}
          onDeleteCategory={deleteCategory}

          onEditSubcategory={(sub, catId) => {
            setEditingSubcategoryId(sub.id)
            setEditingSubcategoryName(sub.name)
            setEditingSubcategoryDescription(sub.description || '')
            setEditingSubcategoryCategoryId(catId)
          }}
          onChangeSubcategoryName={setEditingSubcategoryName}
          onChangeSubcategoryDescription={setEditingSubcategoryDescription}
          onChangeSubcategoryCategory={setEditingSubcategoryCategoryId}
          onSaveSubcategory={saveSubcategory}
          onCancelEditSubcategory={() => setEditingSubcategoryId(null)}
          onDeleteSubcategory={deleteSubcategory}
        />

        <main className="flex-1 w-64">
          {view === 'notes' && (
            <NoteList
              notes={notes}
              categories={categories}
            />

          )}

          {view === 'newNote' && (
            <NoteForm
              categories={categories}
              selectedSubcategory={selectedSubcategory ?? undefined}
              note={newNote}       
              setNote={setNewNote}
              createNote={createNote}
              addSnippet={addSnippet}
              updateSnippet={updateSnippet}
              removeSnippet={removeSnippet}
              onCancel={() => setView('notes')}
            />
          )}

          {view === 'newCategory' && (
            <CategoryForm
              category={newCategory}
              setCategory={setNewCategory}
              createCategory={createCategory}
              onCancel={() => setView('notes')}
            />
          )}

          {view === 'newSubcategory' && (
            <SubcategoryForm
              categories={categories} // pour le select de catégorie
              subcategory={newSubcategory}
              setSubcategory={setNewSubcategory}
              createSubcategory={createSubcategory}
              onCancel={() => setView('notes')}
            />
          )}
        </main>
      </div>
    </div>
  )
}
