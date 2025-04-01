import { CalendarView } from "@/components/calendar-view"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Meal Planner</h1>
        <div className="grid md:grid-cols-[1fr_300px] gap-6">
          <CalendarView />
        </div>
      </div>
    </div>
  )
}

