import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  className?: string
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  
  const daysInMonth = lastDayOfMonth.getDate()
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => null)
  
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]
  
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  
  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }
  
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }
  
  const selectDate = (day: number) => {
    const selectedDate = new Date(year, month, day)
    if (selectedDate >= today && onSelect) {
      onSelect(selectedDate)
    }
  }
  
  const isSelected = (day: number) => {
    if (!selected) return false
    return selected.getDate() === day && 
           selected.getMonth() === month && 
           selected.getFullYear() === year
  }
  
  const isPast = (day: number) => {
    const date = new Date(year, month, day)
    return date < today
  }
  
  return (
    <div className={cn("p-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={previousMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="font-semibold">
          {monthNames[month]} {year}
        </h2>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, index) => (
          <div key={index} className="p-2" />
        ))}
        {daysArray.map((day) => (
          <button
            key={day}
            onClick={() => selectDate(day)}
            disabled={isPast(day)}
            className={cn(
              "p-2 text-sm rounded-md hover:bg-accent transition-colors",
              isSelected(day) && "bg-primary text-primary-foreground hover:bg-primary/90",
              isPast(day) && "text-muted-foreground cursor-not-allowed opacity-50"
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}