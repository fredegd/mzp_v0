"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, ChefHat, ShoppingCart, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="flex justify-between border rounded-lg overflow-hidden">
      <Link href="/" className="flex-1">
        <Button variant="ghost" className={cn("w-full rounded-none h-12", pathname === "/" ? "bg-muted" : "")}>
          <Calendar className="h-5 w-5" />
        </Button>
      </Link>
      <Link href="/recipes" className="flex-1">
        <Button
          variant="ghost"
          className={cn("w-full rounded-none h-12", pathname.startsWith("/recipes") ? "bg-muted" : "")}
        >
          <ChefHat className="h-5 w-5" />
        </Button>
      </Link>
      <Link href="/shopping-list" className="flex-1">
        <Button
          variant="ghost"
          className={cn("w-full rounded-none h-12", pathname === "/shopping-list" ? "bg-muted" : "")}
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </Link>
      <Link href="/settings" className="flex-1">
        <Button variant="ghost" className={cn("w-full rounded-none h-12", pathname === "/settings" ? "bg-muted" : "")}>
          <Settings className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  )
}

