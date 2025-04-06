// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import React from "react";
import {
  addDays,
  addHours,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryStates } from "nuqs";

import { Button } from "@amaxa/ui/button";
import { Card, CardContent } from "@amaxa/ui/card";
import { ScrollArea } from "@amaxa/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";

import { searchParamsCache } from "../_search/searchParams";

const generateTimeSlots = () => {
  const slots = [];
  let currentTime = startOfDay(new Date());
  for (let i = 0; i < 24; i++) {
    slots.push(format(currentTime, "HH:mm"));
    currentTime = addHours(currentTime, 1);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const timezones = [
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const CustomCalendar = ({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void; // Changed this line
}) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const startDate = startOfMonth(monthStart);
  const endDate = endOfMonth(monthEnd);

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="grid grid-cols-7 gap-1">
      {dateRange.map((date, i) => (
        <Button
          key={i}
          variant="ghost"
          className={`h-12 w-full ${
            !isSameMonth(date, monthStart)
              ? "text-gray-400"
              : isSameDay(date, selectedDate)
                ? "bg-primary text-primary-foreground"
                : ""
          }`}
          onClick={() => onSelectDate(date)}
        >
          {format(date, "d")}
        </Button>
      ))}
    </div>
  );
};

export function DateTimePicker() {
  const [{ selectedDate, is24Hour, timezone }, setQueryStates] =
    useQueryStates(searchParamsCache);
  const [selectedTimeSlots, setSelectedTimeSlots] = React.useState<
    Record<string, string[]>
  >({});

  const handleTimeSlotToggle = (slot: string) => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    setSelectedTimeSlots((prev) => {
      const updatedSlots = prev[dateKey] ? [...prev[dateKey]] : [];
      const index = updatedSlots.indexOf(slot);
      if (index > -1) {
        updatedSlots.splice(index, 1);
      } else {
        updatedSlots.push(slot);
      }
      return { ...prev, [dateKey]: updatedSlots };
    });
  };

  const formatTime = (time: string) => {
    if (is24Hour) return time;
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours ?? "", 10);
    const ampm = hour >= 12 ? "pm" : "am";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes}${ampm}`;
  };

  const convertToLocalTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const utcDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hours,
        minutes,
      ),
    );
    const localDate = new Date(
      utcDate.toLocaleString("en-US", { timeZone: timezone }),
    );
    return format(localDate, is24Hour ? "HH:mm" : "h:mma");
  };

  const handlePrevMonth = () =>
    setQueryStates({ selectedDate: subMonths(selectedDate, 1) });
  const handleNextMonth = () =>
    setQueryStates({ selectedDate: addMonths(selectedDate, 1) });

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-2/3 border-r">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-semibold">
                {format(selectedDate, "MMMM yyyy")}
              </h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handlePrevMonth}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <CustomCalendar
                selectedDate={selectedDate}
                onSelectDate={(date: Date) => {
                  setQueryStates({ selectedDate: date }).catch(console.error);
                }}
              />
            </div>
          </div>
          <div className="w-1/3">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-semibold">
                {format(selectedDate, "EEE dd")}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQueryStates({ is24Hour: !is24Hour })}
              >
                {is24Hour ? "12h" : "24h"}
              </Button>
            </div>
            <ScrollArea className="h-[350px]">
              <div className="space-y-2 p-4">
                {timeSlots.map((slot) => {
                  const dateKey = format(selectedDate, "yyyy-MM-dd");
                  const isSelected =
                    selectedTimeSlots[dateKey]?.includes(slot) || false;
                  return (
                    <Button
                      key={slot}
                      variant={isSelected ? "primary" : "outline"}
                      className={`w-full justify-start ${isSelected ? "bg-primary text-primary-foreground" : ""}`}
                      onClick={() => handleTimeSlotToggle(slot)}
                    >
                      {convertToLocalTime(slot)}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className="border-t p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Avaliable Time Slots</h3>
            <Select
              value={timezone ?? ""} // Added a fallback empty string
              onValueChange={(value) => setQueryStates({ timezone: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ScrollArea className="h-[100px]">
            {Object.entries(selectedTimeSlots).map(([date, slots]) => (
              <div key={date} className="mb-2">
                <h4 className="font-medium">
                  {format(new Date(date), "MMMM d, yyyy")}
                </h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <span
                      key={`${date}-${slot}`}
                      className="rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground"
                    >
                      {convertToLocalTime(slot)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
