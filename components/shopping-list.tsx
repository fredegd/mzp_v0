"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMealPlan } from "@/context/meal-plan-context"
import { addDays, format, startOfWeek } from "date-fns"

export function ShoppingList() {
  const { getAllMealPlans } = useMealPlan()
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date()))
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  // Generate week options for the last 4 weeks and next 4 weeks
  const weekOptions = Array.from({ length: 8 }, (_, i) => {
    const weekStart = startOfWeek(addDays(new Date(), (i - 4) * 7))
    const weekEnd = addDays(weekStart, 6)
    return {
      value: format(weekStart, "yyyy-MM-dd"),
      label: `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`,
    }
  })

  // Generate shopping list based on meal plans for the selected week
  const generateShoppingList = () => {
    const endDate = addDays(startDate, 6)
    const allMealPlans = getAllMealPlans()

    // Filter meal plans for the selected week
    const weekMealPlans = Object.values(allMealPlans).filter((plan) => {
      const planDate = new Date(plan.date)
      return planDate >= startDate && planDate <= endDate
    })

    // Collect all ingredients
    const ingredients: Record<string, { amount: number; unit: string; originalAmounts: string[] }> = {}

    weekMealPlans.forEach((plan) => {
      Object.values(plan.meals).forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          const key = ingredient.name.toLowerCase()
          const parsedAmount = Number.parseFloat(ingredient.amount)

          if (ingredients[key]) {
            // If the units match, add the amounts
            if (ingredients[key].unit === ingredient.unit && !isNaN(parsedAmount)) {
              ingredients[key].amount += parsedAmount
            } else {
              // If units don't match or amount isn't a number, keep track of original amounts
              ingredients[key].originalAmounts.push(`${ingredient.amount} ${ingredient.unit}`)
            }
          } else {
            // First time seeing this ingredient
            ingredients[key] = {
              amount: isNaN(parsedAmount) ? 0 : parsedAmount,
              unit: ingredient.unit,
              originalAmounts: isNaN(parsedAmount) ? [`${ingredient.amount} ${ingredient.unit}`] : [],
            }
          }
        })
      })
    })

    return Object.entries(ingredients).map(([name, details]) => {
      let displayAmount

      if (details.amount > 0 && details.originalAmounts.length === 0) {
        // We have a clean numeric total
        displayAmount = `${details.amount} ${details.unit}`
      } else if (details.amount > 0 && details.originalAmounts.length > 0) {
        // We have both numeric and non-numeric amounts
        displayAmount = `${details.amount} ${details.unit} + ${details.originalAmounts.join(", ")}`
      } else {
        // We only have non-numeric amounts
        displayAmount = details.originalAmounts.join(", ")
      }

      return {
        name,
        amount: displayAmount,
        unit: "", // Unit is now included in the displayAmount
        id: name.replace(/\s+/g, "-").toLowerCase(),
      }
    })
  }

  const shoppingList = generateShoppingList()

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Shopping List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="week-select">Select Week</Label>
              <Select value={format(startDate, "yyyy-MM-dd")} onValueChange={(value) => setStartDate(new Date(value))}>
                <SelectTrigger id="week-select">
                  <SelectValue placeholder="Select a week" />
                </SelectTrigger>
                <SelectContent>
                  {weekOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setCheckedItems({})}>Clear Checked Items</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shopping List</CardTitle>
        </CardHeader>
        <CardContent>
          {shoppingList.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No meals planned for this week</p>
            </div>
          ) : (
            <div className="space-y-4">
              {shoppingList.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={!!checkedItems[item.id]}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <Label
                    htmlFor={item.id}
                    className={`flex-1 ${checkedItems[item.id] ? "line-through text-muted-foreground" : ""}`}
                  >
                    {item.name} ({item.amount})
                  </Label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

