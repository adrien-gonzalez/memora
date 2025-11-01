import { Dispatch, SetStateAction } from "react";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import LoadingSpinner from "../ui/LoadingSpinner";

type CategoryFormProps = {
  category: { name: string; description: string }
  setCategory: Dispatch<SetStateAction<{ name: string; description: string }>>
  createCategory: () => void
  onCancel: () => void
  isCreating?: boolean
}

export default function CategoryForm({ category, setCategory, createCategory, onCancel, isCreating }: CategoryFormProps) {
  return (
    <div className="bg-[var(--background)] border border-[#30363d] rounded-md p-6">
      <h2 className="text-xl font-semibold mb-4">Nouvelle Catégorie</h2>
      <Input
        value={category.name}
        onChange={e => setCategory({ ...category, name: e.target.value })}
        placeholder="Nom"
        className="mb-2"
      />

      <Textarea
        value={category.description}
        onChange={e => setCategory({ ...category, description: e.target.value })}
        placeholder="Description (optionnel)"
        rows={3}
        className="mb-2"
      />
      <div className="flex gap-2">
        <button
          onClick={createCategory}
          disabled={isCreating}
          className={`cursor-pointer flex items-center justify-center px-4 py-2 rounded-md text-black ${
            isCreating
              ? 'bg-[#d0d7de] opacity-75 cursor-not-allowed'
              : 'bg-[#e6edf3] hover:bg-[#d0d7de]'
          }`}
        >
          {isCreating ? <LoadingSpinner text="Création..." /> : 'Créer'}
        </button>
        <button onClick={onCancel} className="cursor-pointer px-4 py-2 bg-[var(--button)] rounded-md">Annuler</button>
      </div>
    </div>
  )
}
