import { RecipeList } from "@/components/recipe-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default function RecipesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <Link href="/recipes/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Recipe
          </Button>
        </Link>
      </div>
      <RecipeList />
    </div>
  )
}

