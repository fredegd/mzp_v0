"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { DayMealPlan } from "@/components/day-meal-plan"
import { MealPlanDialog } from "@/components/meal-plan-dialog"
import { useMealPlan } from "@/context/meal-plan-context"
import { format } from "date-fns"

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { getMealPlanForDate } = useMealPlan()

  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
  const mealPlan = getMealPlanForDate(formattedDate)

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
            </h2>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Meal
            </Button>
          </div>
          {selectedDate && (
            <DayMealPlan date={formattedDate} mealPlan={mealPlan} onEdit={() => setIsDialogOpen(true)} />
          )}
        </CardContent>
      </Card>
      <Card className="md:row-span-2">
        <CardContent className="p-4">
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
        </CardContent>
      </Card>
      <MealPlanDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        date={formattedDate}
        initialMealPlan={mealPlan}
      />
    </>
  )
}

