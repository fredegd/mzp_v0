import type { Recipe } from "@/types"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/lib/supabase"

// Function to convert database recipe to app recipe
const dbRecipeToAppRecipe = (dbRecipe: any): Recipe => {
  return {
    id: dbRecipe.id,
    name: dbRecipe.name,
    description: dbRecipe.description,
    ingredients: dbRecipe.ingredients,
    instructions: dbRecipe.instructions,
    cookTime: dbRecipe.cook_time,
    servings: dbRecipe.servings,
  }
}

// Function to convert app recipe to database recipe
const appRecipeToDbRecipe = (recipe: Omit<Recipe, "id">, id?: string) => {
  return {
    id: id || uuidv4(),
    name: recipe.name,
    description: recipe.description,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    cook_time: recipe.cookTime,
    servings: recipe.servings,
    updated_at: new Date().toISOString(),
  }
}

// Fallback to localStorage if Supabase is not configured
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export async function getRecipes(): Promise<Recipe[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("recipes").select("*").order("name")

      if (error) {
        console.error("Error fetching recipes from Supabase:", error)
        throw error
      }

      return data.map(dbRecipeToAppRecipe)
    } catch (error) {
      console.error("Failed to fetch recipes from Supabase, falling back to localStorage:", error)
      // Fall back to localStorage
    }
  }

  // Fallback to localStorage
  if (typeof window === "undefined") {
    return []
  }

  const storedRecipes = localStorage.getItem("recipes")
  return storedRecipes ? JSON.parse(storedRecipes) : []
}

export async function getRecipe(id: string): Promise<Recipe> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("recipes").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching recipe from Supabase:", error)
        throw error
      }

      return dbRecipeToAppRecipe(data)
    } catch (error) {
      console.error("Failed to fetch recipe from Supabase, falling back to localStorage:", error)
      // Fall back to localStorage
    }
  }

  // Fallback to localStorage
  const recipes = await getRecipesFromLocalStorage()
  const recipe = recipes.find((r) => r.id === id)

  if (!recipe) {
    throw new Error(`Recipe with ID ${id} not found`)
  }

  return recipe
}

export async function saveRecipe(recipeData: Omit<Recipe, "id">, id?: string): Promise<Recipe> {
  if (isSupabaseConfigured()) {
    try {
      const dbRecipe = appRecipeToDbRecipe(recipeData, id)

      if (id) {
        // Update existing recipe
        const { data, error } = await supabase.from("recipes").update(dbRecipe).eq("id", id).select().single()

        if (error) {
          console.error("Error updating recipe in Supabase:", error)
          throw error
        }

        return dbRecipeToAppRecipe(data)
      } else {
        // Create new recipe
        const { data, error } = await supabase.from("recipes").insert(dbRecipe).select().single()

        if (error) {
          console.error("Error creating recipe in Supabase:", error)
          throw error
        }

        return dbRecipeToAppRecipe(data)
      }
    } catch (error) {
      console.error("Failed to save recipe to Supabase, falling back to localStorage:", error)
      // Fall back to localStorage
    }
  }

  // Fallback to localStorage
  return saveRecipeToLocalStorage(recipeData, id)
}

export async function deleteRecipe(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from("recipes").delete().eq("id", id)

      if (error) {
        console.error("Error deleting recipe from Supabase:", error)
        throw error
      }

      return
    } catch (error) {
      console.error("Failed to delete recipe from Supabase, falling back to localStorage:", error)
      // Fall back to localStorage
    }
  }

  // Fallback to localStorage
  const recipes = await getRecipesFromLocalStorage()
  const filteredRecipes = recipes.filter((r) => r.id !== id)

  localStorage.setItem("recipes", JSON.stringify(filteredRecipes))
}

// Helper functions for localStorage fallback
async function getRecipesFromLocalStorage(): Promise<Recipe[]> {
  if (typeof window === "undefined") {
    return []
  }

  const storedRecipes = localStorage.getItem("recipes")
  return storedRecipes ? JSON.parse(storedRecipes) : []
}

async function saveRecipeToLocalStorage(recipeData: Omit<Recipe, "id">, id?: string): Promise<Recipe> {
  const recipes = await getRecipesFromLocalStorage()

  if (id) {
    // Update existing recipe
    const index = recipes.findIndex((r) => r.id === id)

    if (index === -1) {
      throw new Error(`Recipe with ID ${id} not found`)
    }

    const updatedRecipe = { ...recipeData, id }
    recipes[index] = updatedRecipe
    localStorage.setItem("recipes", JSON.stringify(recipes))

    return updatedRecipe
  } else {
    // Create new recipe
    const newRecipe = { ...recipeData, id: uuidv4() }
    recipes.push(newRecipe)
    localStorage.setItem("recipes", JSON.stringify(recipes))

    return newRecipe
  }
}

