import { Category } from "@/lib/types";
import { Dispatch, SetStateAction, useEffect } from "react";

type SubcategoryFormProps = {
  categories: Category[]
  subcategory: { name: string; description: string; categoryId: string }
  setSubcategory: Dispatch<SetStateAction<{ name: string; description: string; categoryId: string }>>
  createSubcategory: () => void
  onCancel: () => void
}

export default function SubcategoryForm({
  categories,
  subcategory,
  setSubcategory,
  createSubcategory,
  onCancel
}: SubcategoryFormProps) {

  useEffect(() => {
    if (categories.length === 1) {
      setSubcategory(prev => ({ ...prev, categoryId: categories[0].id }))
    }
  }, [categories])

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6">
      <h2 className="text-xl font-semibold mb-4">Nouvelle Sous-catégorie</h2>
      <select
        value={subcategory.categoryId}
        onChange={e => setSubcategory({ ...subcategory, categoryId: e.target.value })}
        className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md mb-2"
      >
        <option value="">Sélectionner une catégorie</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <input
        type="text"
        value={subcategory.name}
        onChange={e => setSubcategory({ ...subcategory, name: e.target.value })}
        placeholder="Nom"
        className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md mb-2"
      />
      <textarea
        value={subcategory.description}
        onChange={e => setSubcategory({ ...subcategory, description: e.target.value })}
        placeholder="Description (optionnel)"
        rows={3}
        className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md mb-2"
      />
      <div className="flex gap-2">
        <button onClick={createSubcategory} className="text-black cursor-pointer px-4 py-2 bg-[#e6edf3] rounded-md hover:bg-[#d0d7de]">Créer</button>
        <button onClick={onCancel} className="cursor-pointer px-4 py-2 bg-[#21262d] rounded-md">Annuler</button>
      </div>
    </div>
  )
}
