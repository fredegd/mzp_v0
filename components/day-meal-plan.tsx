"use client"

import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"
import type { MealPlan } from "@/types"

interface DayMealPlanProps {
  date: string
  mealPlan: MealPlan | null
  onEdit: () => void
}

export function DayMealPlan({ date, mealPlan, onEdit }: DayMealPlanProps) {
  if (!mealPlan || Object.keys(mealPlan.meals).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No meals planned for this day</p>
        <Button onClick={onEdit}>Plan Meals</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {Object.entries(mealPlan.meals).map(([mealType, recipe]) => (
        <div key={mealType} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium capitalize">{mealType}</h3>
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm">
            <p className="font-medium">{recipe.name}</p>
            <p className="text-muted-foreground">{recipe.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

