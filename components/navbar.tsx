import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, ChefHat, ShoppingCart, Settings } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            Meal Planner
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Button>
            </Link>
            <Link href="/recipes">
              <Button variant="ghost" className="flex items-center">
                <ChefHat className="mr-2 h-4 w-4" />
                Recipes
              </Button>
            </Link>
            <Link href="/shopping-list">
              <Button variant="ghost" className="flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Shopping List
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation - visible on all pages */}
        <div className="md:hidden mt-3 mb-1">
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

