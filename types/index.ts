export interface Ingredient {
  name: string
  amount: string
  unit: string
}

export interface Recipe {
  id: string
  name: string
  description: string
  ingredients: Ingredient[]
  instructions: string
  cookTime: number
  servings: number
}

export interface MealPlan {
  date: string
  meals: Record<string, Recipe>
}

