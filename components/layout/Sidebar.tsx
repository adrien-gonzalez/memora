'use client'

import MenuActions from '@/components/MenuActions'
import { Category, Subcategory } from '@/lib/types'
import CheckIcon from '../CheckIcon'
import Input from '../ui/Input'

type SidebarProps = {
  categories: Category[]
  selectedSubcategory: string | null

  editingCategoryId: string | null
  editingCategoryName: string
  editingCategoryDescription: string
  editingSubcategoryId: string | null
  editingSubcategoryName: string
  editingSubcategoryDescription: string
  editingSubcategoryCategoryId: string

  onSelectAllNotes: () => void
  onSelectSubcategory: (subId: string) => void

  onEditCategory: (catId: string, name: string, description: string) => void
  onChangeCategoryName: (name: string) => void
  onChangeCategoryDescription: (desc: string) => void
  onSaveCategory: (catId: string) => void
  onCancelEditCategory: () => void
  onDeleteCategory: (catId: string) => void

  onEditSubcategory: (sub: Subcategory, parentCatId: string) => void
  onChangeSubcategoryName: (name: string) => void
  onChangeSubcategoryDescription: (desc: string) => void
  onChangeSubcategoryCategory: (catId: string) => void
  onSaveSubcategory: (subId: string) => void
  onCancelEditSubcategory: () => void
  onDeleteSubcategory: (subId: string) => void
}

export default function Sidebar({
  categories,
  selectedSubcategory,

  editingCategoryId,
  editingCategoryName,
  editingCategoryDescription,
  editingSubcategoryId,
  editingSubcategoryName,
  editingSubcategoryDescription,
  editingSubcategoryCategoryId,

  onSelectAllNotes,
  onSelectSubcategory,

  onEditCategory,
  onChangeCategoryName,
  onChangeCategoryDescription,
  onSaveCategory,
  onCancelEditCategory,
  onDeleteCategory,

  onEditSubcategory,
  onChangeSubcategoryName,
  onChangeSubcategoryDescription,
  onChangeSubcategoryCategory,
  onSaveSubcategory,
  onCancelEditSubcategory,
  onDeleteSubcategory,
}: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-[var(--background)] border border-[#30363d] rounded-md p-4">
        <h2 className="text-sm font-semibold mb-3 text-[#7d8590]">CATÉGORIES</h2>
        <button
          onClick={onSelectAllNotes}
          className={`cursor-pointer w-full text-left px-3 py-2 rounded-md text-sm ${
            !selectedSubcategory
              ? 'bg-[#e6edf3] text-[#0d1117] font-medium'
              : 'hover:bg-[var(--hover)]'
          }`}
        >
          Tous les penses-bêtes
        </button>

        <div className="space-y-2 mt-2">
          {categories.map(cat => (
            <div key={cat.id} className="space-y-1">
              {/* Catégorie */}
              {editingCategoryId === cat.id ? (
                <div className="flex gap-2 items-center flex-col">
                  <Input
                    label="Nom de la catégorie"
                    value={editingCategoryName}
                    onChange={e => onChangeCategoryName(e.target.value)}
                    placeholder="Nom de la catégorie"
                    className="text-sm px-2 py-1"
                  />

                  <Input
                    label="Description de la catégorie"
                    value={editingCategoryDescription}
                    onChange={e => onChangeCategoryDescription(e.target.value)}
                    placeholder="Description (optionnel)"
                    className="text-sm px-2 py-1"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => onSaveCategory(cat.id)} className="border-[#30363d] cursor-pointer px-2 py-1 bg-[#e6edf3] text-white rounded text-sm">
                      <CheckIcon className=" w-6 h-6 text-green-500" />
                    </button>
                    <button onClick={onCancelEditCategory} className="cursor-pointer px-2 py-1 bg-[#e6edf3] text-white rounded text-sm">❌</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="px-3 py-2 text-sm font-medium">{cat.name}</span>
                  <MenuActions
                    onEdit={() => onEditCategory(cat.id, cat.name, cat.description || '')}
                    onDelete={() => onDeleteCategory(cat.id)}
                  />
                </div>
              )}

              {/* Sous-catégories */}
              {cat?.subcategories && cat?.subcategories?.map(sub => (
                <div key={sub.id} className="flex items-center gap-2 pl-6">
                  {editingSubcategoryId === sub.id ? (
                    <div className="flex gap-2 items-center flex-col w-full">
                      <Input
                        value={editingSubcategoryName}
                        onChange={e => onChangeSubcategoryName(e.target.value)}
                        placeholder="Nom de la sous-catégorie"
                        className="text-sm px-2 py-1 w-full"
                      />

                      <Input
                        value={editingSubcategoryDescription}
                        onChange={e => onChangeSubcategoryDescription(e.target.value)}
                        placeholder="Description (optionnel)"
                        className="text-sm px-2 py-1 w-full"
                      />
                      
                      <select
                        value={editingSubcategoryCategoryId}
                        onChange={e => onChangeSubcategoryCategory(e.target.value)}
                        className="px-2 py-1 bg-[var(--background)] border border-[#30363d] rounded text-sm w-full"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button onClick={() => onSaveSubcategory(sub.id)} className="border-[#30363d] cursor-pointer px-2 py-1 bg-[#e6edf3] text-white rounded text-sm">
                          <CheckIcon className="w-6 h-6 text-green-500" />
                        </button>
                        <button onClick={onCancelEditSubcategory} className="cursor-pointer px-2 py-1 bg-[#e6edf3] text-white rounded text-sm">❌</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => onSelectSubcategory(sub.id)}
                        className={`cursor-pointer w-full text-left px-3 py-1.5 rounded-md text-sm ${
                          selectedSubcategory === sub.id
                            ? 'bg-[#e6edf3] text-[#0d1117] font-medium'
                            : 'hover:bg-[var(--hover)]'
                        }`}
                      >
                        {sub.name} <span className="text-xs text-[#7d8590]">({sub._count?.notes || 0})</span>
                      </button>
                      <MenuActions
                        onEdit={() => onEditSubcategory(sub, cat.id)}
                        onDelete={() => onDeleteSubcategory(sub.id)}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
