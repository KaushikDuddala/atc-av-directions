"use client"

import type { AudioGroup } from "@/lib/types"
import { DirectionColumn } from "./direction-column"

export function DirectionsDisplay({
  group,
  currentTime,
}: {
  group: AudioGroup
  currentTime: number
}) {
  // Find current direction (last direction that is <= currentTime)
  const currentDirection =
    group.directions.filter((d) => d.startTime <= currentTime).sort((a, b) => b.startTime - a.startTime)[0] || null

  // Find next direction (first direction that is > currentTime)
  const nextDirection = group.directions.find((d) => d.startTime > currentTime) || null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <DirectionColumn label="CURRENT" direction={currentDirection} />
      <DirectionColumn label="NEXT" direction={nextDirection} />
    </div>
  )
}
