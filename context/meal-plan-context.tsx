"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { MealPlan } from "@/types"
import { getMealPlans, saveMealPlan as saveMealPlanToDb } from "@/lib/meal-plans"

interface MealPlanContextType {
  getMealPlanForDate: (date: string) => MealPlan | null
  saveMealPlan: (date: string, mealPlan: MealPlan) => void
  getAllMealPlans: () => Record<string, MealPlan>
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined)

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [mealPlans, setMealPlans] = useState<Record<string, MealPlan>>({})
  const [loading, setLoading] = useState(true)

  // Load meal plans on initial render
  useEffect(() => {
    const loadMealPlans = async () => {
      try {
        const plans = await getMealPlans()
        setMealPlans(plans)
      } catch (error) {
        console.error("Failed to load meal plans:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMealPlans()
  }, [])

  const getMealPlanForDate = (date: string) => {
    return mealPlans[date] || null
  }

  const saveMealPlan = async (date: string, mealPlan: MealPlan) => {
    try {
      await saveMealPlanToDb(date, mealPlan)

      // Update local state
      setMealPlans((prev) => ({
        ...prev,
        [date]: mealPlan,
      }))
    } catch (error) {
      console.error("Failed to save meal plan:", error)
    }
  }

  const getAllMealPlans = () => {
    return mealPlans
  }

  return (
    <MealPlanContext.Provider value={{ getMealPlanForDate, saveMealPlan, getAllMealPlans }}>
      {children}
    </MealPlanContext.Provider>
  )
}

export function useMealPlan() {
  const context = useContext(MealPlanContext)
  if (context === undefined) {
    throw new Error("useMealPlan must be used within a MealPlanProvider")
  }
  return context
}

