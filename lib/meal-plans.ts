import type { MealPlan } from "@/types"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/lib/supabase"

// Function to convert database meal plan to app meal plan
const dbMealPlanToAppMealPlan = (dbMealPlan: any): MealPlan => {
  return {
    date: dbMealPlan.date,
    meals: dbMealPlan.meals,
  }
}

// Fallback to localStorage if Supabase is not configured
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export async function getMealPlans(): Promise<Record<string, MealPlan>> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("meal_plans").select("*")

      if (error) {
        console.error("Error fetching meal plans from Supabase:", error)
        throw error
      }

      // Convert array to record with date as key
      const mealPlansRecord: Record<string, MealPlan> = {}
      data.forEach((plan) => {
        mealPlansRecord[plan.date] = dbMealPlanToAppMealPlan(plan)
      })

      return mealPlansRecord
    } catch (error) {
      console.error("Failed to fetch meal plans from Supabase, falling back to localStorage:", error)
      // Fall back to localStorage
    }
  }

  // Fallback to localStorage
  if (typeof window === "undefined") {
    return {}
  }

  const storedMealPlans = localStorage.getItem("mealPlans")
  return storedMealPlans ? JSON.parse(storedMealPlans) : {}
}

export async function getMealPlan(date: string): Promise<MealPlan | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from("meal_plans").select("*").eq("date", date).single()

      if (error) {
        if (error.code === "PGRST116") {
          // No meal plan found for this date
          return null
        }
        console.error("Error fetching meal plan from Supabase:", error)
        throw error
      }

      return dbMealPlanToAppMealPlan(data)
    } catch (error) {
      console.error("Failed to fetch meal plan from Supabase, falling back to localStorage:", error)
      // Fall back to localStorage
    }
  }

  // Fallback to localStorage
  const mealPlans = await getMealPlansFromLocalStorage()
  return mealPlans[date] || null
}

export async function saveMealPlan(date: string, mealPlan: MealPlan): Promise<MealPlan> {
  if (isSupabaseConfigured()) {
    try {
      // Check if meal plan already exists
      const { data: existingPlan, error: checkError } = await supabase
        .from("meal_plans")
        .select("id")
        .eq("date", date)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking for existing meal plan in Supabase:", checkError)
        throw checkError
      }

      if (existingPlan) {
        // Update existing meal plan
        const { data, error } = await supabase
          .from("meal_plans")
          .update({
            meals: mealPlan.meals,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingPlan.id)
          .select()
          .single()

        if (error) {
          console.error("Error updating meal plan in Supabase:", error)
          throw error
        }

        return dbMealPlanToAppMealPlan(data)
      } else {
        // Create new meal plan
        const { data, error } = await supabase
          .from("meal_plans")
          .insert({
            id: uuidv4(),
            date,
            meals: mealPlan.meals,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) {
          console.error("Error creating meal plan in Supabase:", error)
          throw error
        }

        return dbMealPlanToAppMealPlan(data)
      }
    } catch (error) {
      console.error("Failed to save meal plan to Supabase, falling back to localStorage:", error)
      // Fall back to localStorage
    }
  }

  // Fallback to localStorage
  return saveMealPlanToLocalStorage(date, mealPlan)
}

export async function deleteMealPlan(date: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from("meal_plans").delete().eq("date", date)

      if (error) {
        console.error("Error deleting meal plan from Supabase:", error)
        throw error
      }

      return
    } catch (error) {
      console.error("Failed to delete meal plan from Supabase, falling back to localStorage:", error)
      // Fall back to localStorage
    }
  }

  // Fallback to localStorage
  const mealPlans = await getMealPlansFromLocalStorage()
  delete mealPlans[date]

  localStorage.setItem("mealPlans", JSON.stringify(mealPlans))
}

// Helper functions for localStorage fallback
async function getMealPlansFromLocalStorage(): Promise<Record<string, MealPlan>> {
  if (typeof window === "undefined") {
    return {}
  }

  const storedMealPlans = localStorage.getItem("mealPlans")
  return storedMealPlans ? JSON.parse(storedMealPlans) : {}
}

async function saveMealPlanToLocalStorage(date: string, mealPlan: MealPlan): Promise<MealPlan> {
  const mealPlans = await getMealPlansFromLocalStorage()

  mealPlans[date] = mealPlan
  localStorage.setItem("mealPlans", JSON.stringify(mealPlans))

  return mealPlan
}

