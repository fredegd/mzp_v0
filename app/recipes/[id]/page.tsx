"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, notFound } from "next/navigation"
import { RecipeForm } from "@/components/recipe-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getRecipe, deleteRecipe } from "@/lib/recipes"
import type { Recipe } from "@/types"

export default function EditRecipePage() {
  const params = useParams()
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const id = params.id as string

  // If the ID is "new", this is not the right page - use notFound()
  // This will allow Next.js to continue searching for the correct route
  if (id === "new") {
    return notFound()
  }

  useEffect(() => {
    let isMounted = true

    const loadRecipe = async () => {
      try {
        setLoading(true)
        const recipeData = await getRecipe(id)
        if (isMounted) {
          setRecipe(recipeData)
        }
      } catch (error) {
        console.error("Failed to load recipe:", error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadRecipe()

    return () => {
      isMounted = false
    }
  }, [id])

  const handleDelete = async () => {
    try {
      await deleteRecipe(id)
      router.push("/recipes")
    } catch (error) {
      console.error("Failed to delete recipe:", error)
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>
  }

  if (!recipe) {
    return <div className="container mx-auto px-4 py-6">Recipe not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/recipes">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Recipe</h1>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the recipe.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <RecipeForm initialData={recipe} />
    </div>
  )
}

