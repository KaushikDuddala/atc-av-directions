"use client"

import { useEffect, useState } from "react"
import type { AudioGroup } from "@/lib/types"

export function CountdownTimer({
  group,
  currentTime,
}: {
  group: AudioGroup
  currentTime: number
}) {
  const [timeToNext, setTimeToNext] = useState<number | null>(null)

  useEffect(() => {
    // Find next direction
    const nextDirection = group.directions.find((d) => d.startTime > currentTime)

    if (nextDirection) {
      const remaining = nextDirection.startTime - currentTime
      setTimeToNext(Math.max(0, remaining))
    } else {
      setTimeToNext(null)
    }
  }, [group, currentTime])

  if (timeToNext === null) {
    return (
      <div className="text-center p-8 rounded-lg border-2 border-border bg-card">
        <p className="text-muted-foreground mb-2">No more changes</p>
        <div className="text-6xl font-bold">--:--</div>
      </div>
    )
  }

  const minsCurrent = Math.floor(currentTime / 60000) 
  const secondsCurrent = Math.floor((currentTime % 60000) / 1000)

  const minutes = Math.floor(timeToNext / 60000)
  const seconds = Math.floor((timeToNext % 60000) / 1000)

  return (
    <div className="flex gap-4">
      <div className="flex-1 text-center p-8 rounded-lg border-2 border-border bg-card">
        <p className="text-muted-foreground mb-4 font-medium">Current Time</p>
        <div className="text-7xl font-bold font-mono tracking-tight">
          {minsCurrent}:{secondsCurrent.toString().padStart(2, "0")}
        </div>
      </div>

      <div className="flex-1 text-center p-8 rounded-lg border-2 border-border bg-card">
        <p className="text-muted-foreground mb-4 font-medium">Time to next change</p>
        <div className="text-7xl font-bold font-mono tracking-tight">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>
    </div>
  )
}
