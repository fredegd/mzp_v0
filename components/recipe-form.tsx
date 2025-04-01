"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, X } from "lucide-react"
import { saveRecipe } from "@/lib/recipes"
import type { Recipe } from "@/types"

interface RecipeFormProps {
  initialData?: Recipe
}

export function RecipeForm({ initialData }: RecipeFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Omit<Recipe, "id">>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    ingredients: initialData?.ingredients || [],
    instructions: initialData?.instructions || "",
    cookTime: initialData?.cookTime || 30,
    servings: initialData?.servings || 2,
  })
  const [newIngredient, setNewIngredient] = useState({ name: "", amount: "", unit: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cookTime" || name === "servings" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewIngredient((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addIngredient = () => {
    if (newIngredient.name.trim() === "") return

    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { ...newIngredient }],
    }))

    setNewIngredient({ name: "", amount: "", unit: "" })
  }

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await saveRecipe(formData, initialData?.id)
      router.push("/recipes")
    } catch (error) {
      console.error("Failed to save recipe:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Recipe Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
        </div>

        <div className="grid gap-2">
          <Label>Ingredients</Label>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 text-sm">
                      {ingredient.amount} {ingredient.unit} {ingredient.name}
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="grid grid-cols-[1fr_80px_80px_auto] gap-2 items-end">
                  <div>
                    <Label htmlFor="ingredient-name" className="sr-only">
                      Ingredient
                    </Label>
                    <Input
                      id="ingredient-name"
                      name="name"
                      placeholder="Ingredient"
                      value={newIngredient.name}
                      onChange={handleIngredientChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ingredient-amount" className="sr-only">
                      Amount
                    </Label>
                    <Input
                      id="ingredient-amount"
                      name="amount"
                      placeholder="Amount"
                      value={newIngredient.amount}
                      onChange={handleIngredientChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ingredient-unit" className="sr-only">
                      Unit
                    </Label>
                    <Input
                      id="ingredient-unit"
                      name="unit"
                      placeholder="Unit"
                      value={newIngredient.unit}
                      onChange={handleIngredientChange}
                    />
                  </div>
                  <Button type="button" variant="outline" size="icon" onClick={addIngredient}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows={6}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cookTime">Cook Time (minutes)</Label>
            <Input
              id="cookTime"
              name="cookTime"
              type="number"
              min="1"
              value={formData.cookTime}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="servings">Servings</Label>
            <Input
              id="servings"
              name="servings"
              type="number"
              min="1"
              value={formData.servings}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : initialData ? "Update Recipe" : "Create Recipe"}
      </Button>
    </form>
  )
}

