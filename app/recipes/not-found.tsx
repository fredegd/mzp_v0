import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function RecipeNotFound() {
  return (
    <div className="container mx-auto px-4 py-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Recipe Not Found</h1>
      <p className="mb-6">The recipe you're looking for doesn't exist or was removed.</p>
      <Link href="/recipes">
        <Button>Back to Recipes</Button>
      </Link>
    </div>
  )
}

