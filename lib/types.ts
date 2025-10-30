// app/lib/types.ts

export type Snippet = {
  id?: string
  code: string
  language: string
  order: number
}

export type Category = {
  id: string
  name: string
  description?: string
  subcategories: Subcategory[]
}

export type Subcategory = {
  id: string
  name: string
  description?: string
  category: Category
  _count?: { notes: number }
}

export type Note = {
  id: string
  title: string
  description: string
  snippets: Snippet[]
  subcategory: Subcategory
}

export type NewSubcategory = { 
  name: string; 
  description: string; 
  categoryId: string 
}

export type UpdateSubcategoryData = {
   name: string; 
   description: string; 
   categoryId: string 
}

export type CreateNoteData = {
  title: string
  description: string
  subcategoryId: string
  snippets: Snippet[]
}

export type UpdateNoteData = {
  title: string
  description: string
  subcategoryId: string
  snippets: Snippet[]
}

export type UpdateNoteOrderData = {
  order: number
}