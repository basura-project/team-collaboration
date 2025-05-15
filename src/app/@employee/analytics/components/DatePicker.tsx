"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    date: {
        from: Date
        to?: Date
    }
    onDateChange?: (range: { from: Date | null; to: Date | null }) => void
    placeholder?: string
    className?: string
}

export function DatePickerWithRange({date, onDateChange, placeholder, className}: DatePickerProps) {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(2024, 1, 1),
    to: addDays(new Date(2024, 12, 31), 20),
  })
  const [tempDateRange, setTempDateRange] = React.useState<DateRange>(dateRange)

  const handleDateChange = (date: DateRange | undefined) => {
    if (date) {
      setTempDateRange(date)
    }
  }

  const handleSubmit = () => {
    setDateRange(tempDateRange)
    onDateChange?.({ from: tempDateRange.from ?? null, to: tempDateRange.to ?? null })
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={tempDateRange}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
          <Button onClick={handleSubmit} className="ml-3 mb-3 mt-2">
            Submit
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
