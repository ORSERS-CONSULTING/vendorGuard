"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function HeaderDatePicker({
  value,
  onChange,
}: {
  value?: Date;
  onChange?: (d?: Date) => void;
}) {
  const [date, setDate] = React.useState<Date | undefined>(value ?? new Date());

  function handleSelect(d?: Date) {
    setDate(d);
    onChange?.(d);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl"
        >
          <CalendarIcon className="h-4 w-4" />
          {date ? format(date, "EEE, d MMM yyyy") : "Pick date"}
          <ChevronDown className="h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          // optional: month/year dropdown like the screenshot
          captionLayout="dropdown"
          fromYear={2018}
          toYear={2030}
        />
      </PopoverContent>
    </Popover>
  );
}
