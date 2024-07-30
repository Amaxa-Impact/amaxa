"use client"

import { CreateEvent } from "./CreateEvent"


export function NoEvents() {
  return (
    <div
      className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
    >
      <div className="flex flex-col items-center gap-1 text-center py-72">
        <h3 className="text-2xl font-bold tracking-tight">
          There are no events yet
        </h3>
        <p className="text-sm text-muted-foreground">
          You can add a new event by clicking the button below
        </p>
        <div />
        <div />
        <CreateEvent />
      </div>
    </div>
  )
}
