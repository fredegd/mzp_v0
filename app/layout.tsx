import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { MealPlanProvider } from "@/context/meal-plan-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Meal Planner",
  description: "Plan your meals and generate shopping lists",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <MealPlanProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
          </MealPlanProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

