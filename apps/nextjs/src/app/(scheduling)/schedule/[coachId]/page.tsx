"use client";

import React, { useState } from "react";
import {
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

import { Button } from "@amaxa/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";
import { ScrollArea } from "@amaxa/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";

import { timezones } from "~/lib/timezones";

const generateTimeSlots = () => {
  const slots = [];
  let currentTime = startOfDay(new Date());
  for (let i = 0; i < 24; i++) {
    // 1-hour intervals for 24 hours
    slots.push(format(currentTime, "HH:mm"));
    currentTime = addHours(currentTime, 1);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const CustomCalendar = ({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
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

export default function DateTimePicker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{
    [key: string]: string[];
  }>({});
  const [is24Hour, setIs24Hour] = useState(false);
  const [timezone, setTimezone] = useState("America/New_York");

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

  const handlePrevMonth = () => setSelectedDate((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setSelectedDate((prev) => addMonths(prev, 1));

  return (
    <Card className="mx-auto h-[calc(100vh-theme(spacing.16))] w-full max-w-7xl">
      <CardHeader>
        <CardTitle className="text-4xl font-bold">
          Schedule Your availability
        </CardTitle>
      </CardHeader>
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
                onSelectDate={setSelectedDate}
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
                onClick={() => setIs24Hour(!is24Hour)}
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
        <div className="w-full border-t p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Selected Time Slots</h3>
            <Select value={timezone} onValueChange={setTimezone}>
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
