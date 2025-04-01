"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { useMealPlan } from "@/context/meal-plan-context"
import { useRecipes } from "@/hooks/use-recipes"
import type { MealPlan, Recipe } from "@/types"

interface MealPlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: string
  initialMealPlan: MealPlan | null
}

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"]

export function MealPlanDialog({ open, onOpenChange, date, initialMealPlan }: MealPlanDialogProps) {
  const { recipes } = useRecipes()
  const { saveMealPlan } = useMealPlan()
  const [selectedMeals, setSelectedMeals] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialMealPlan) {
      const initialSelections: Record<string, string> = {}
      Object.entries(initialMealPlan.meals).forEach(([mealType, recipe]) => {
        initialSelections[mealType] = recipe.id
      })
      setSelectedMeals(initialSelections)
    } else {
      setSelectedMeals({})
    }
  }, [initialMealPlan, open])

  const handleSave = () => {
    const meals: Record<string, Recipe> = {}

    Object.entries(selectedMeals).forEach(([mealType, recipeId]) => {
      const recipe = recipes.find((r) => r.id === recipeId)
      if (recipe) {
        meals[mealType] = recipe
      }
    })

    saveMealPlan(date, { date, meals })
    onOpenChange(false)
  }

  const handleMealChange = (mealType: string, recipeId: string) => {
    setSelectedMeals((prev) => ({
      ...prev,
      [mealType]: recipeId,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Plan Meals for {format(new Date(date), "MMMM d, yyyy")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {MEAL_TYPES.map((mealType) => (
            <div key={mealType} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`meal-${mealType}`} className="text-right capitalize">
                {mealType}
              </Label>
              <div className="col-span-3">
                <Select
                  value={selectedMeals[mealType] || ""}
                  onValueChange={(value) => handleMealChange(mealType, value)}
                >
                  <SelectTrigger id={`meal-${mealType}`}>
                    <SelectValue placeholder="Select a recipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {recipes.map((recipe) => (
                      <SelectItem key={recipe.id} value={recipe.id}>
                        {recipe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

