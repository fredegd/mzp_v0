"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
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
import { Input } from "@/components/ui/input"
import { Moon, Sun, Download, Upload, Trash2, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [defaultServings, setDefaultServings] = useState("2")

  const clearAllData = () => {
    localStorage.removeItem("recipes")
    localStorage.removeItem("mealPlans")
    toast({
      title: "Data cleared",
      description: "All recipes and meal plans have been deleted.",
    })
  }

  const exportData = () => {
    try {
      const recipes = localStorage.getItem("recipes") || "[]"
      const mealPlans = localStorage.getItem("mealPlans") || "{}"

      const data = JSON.stringify(
        {
          recipes: JSON.parse(recipes),
          mealPlans: JSON.parse(mealPlans),
          exportDate: new Date().toISOString(),
        },
        null,
        2,
      ) // Pretty print with 2 spaces

      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `meal-planner-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()

      URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Data exported",
        description: "Your recipes and meal plans have been exported as JSON.",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      })
    }
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)

        if (data.recipes && Array.isArray(data.recipes)) {
          localStorage.setItem("recipes", JSON.stringify(data.recipes))
        }

        if (data.mealPlans && typeof data.mealPlans === "object") {
          localStorage.setItem("mealPlans", JSON.stringify(data.mealPlans))
        }

        toast({
          title: "Data imported",
          description: "Your recipes and meal plans have been imported successfully.",
        })

        // Reset the input
        event.target.value = ""
      } catch (error) {
        toast({
          title: "Import failed",
          description: "There was an error importing your data. Make sure it's a valid JSON file.",
          variant: "destructive",
        })
      }
    }

    reader.readAsText(file)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <Label htmlFor="theme-mode">Dark Mode</Label>
                </div>
                <Switch
                  id="theme-mode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recipe Defaults</CardTitle>
            <CardDescription>Set default values for new recipes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="default-servings">Default Servings</Label>
                <Select value={defaultServings} onValueChange={setDefaultServings}>
                  <SelectTrigger id="default-servings">
                    <SelectValue placeholder="Select servings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export, import, or clear your data</CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>
                      Export/Import includes all your recipes and meal plans in JSON format. The exported file can be
                      used as a backup or to transfer your data to another device.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={exportData} className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data (JSON)
                </Button>

                <div className="relative">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" className="flex items-center w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data (JSON)
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your recipes and meal plans.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAllData}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

