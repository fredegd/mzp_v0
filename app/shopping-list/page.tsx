import { ShoppingList } from "@/components/shopping-list"

export default function ShoppingListPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Shopping List</h1>
      <ShoppingList />
    </div>
  )
}

