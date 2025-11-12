"use client"

import { useEffect, useState } from "react"
import type { AudioGroup, Direction } from "@/lib/types"

export function LightingSection({
  label,
  type,
  group,
  currentTime,
}: {
  label: string
  type: "floodlight" | "overhead"
  group: AudioGroup
  currentTime: number
}) {
  const [current, setCurrent] = useState<Direction | null>(null)
  const [next, setNext] = useState<Direction | null>(null)
  const [timeToNext, setTimeToNext] = useState<number | null>(null)

  useEffect(() => {
    // Find current direction
    const currentDir =
      group.directions.filter((d) => d.timestamp <= currentTime).sort((a, b) => b.timestamp - a.timestamp)[0] || null

    setCurrent(currentDir)

    // Find next direction
    const nextDir = group.directions.find((d) => d.timestamp > currentTime) || null
    setNext(nextDir)

    // Calculate time to next
    if (nextDir) {
      setTimeToNext(Math.max(0, nextDir.timestamp - currentTime))
    } else {
      setTimeToNext(null)
    }
  }, [group, currentTime])

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const renderLightingData = (direction: Direction | null) => {
    if (!direction) {
      return (
        <div className="space-y-2 p-3 rounded bg-muted/30">
          <p className="text-sm text-muted-foreground">--:--</p>
          <p className="text-sm text-muted-foreground">No data</p>
        </div>
      )
    }

    const data = direction[type]

    if (type === "floodlight") {
      return (
        <div className="space-y-2 p-3 rounded bg-muted/30">
          <p className="text-sm font-mono text-foreground">{formatTime(direction.timestamp)}</p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: data.color }} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{data.percent}%</p>
              <p className="text-xs text-muted-foreground">{data.notes}</p>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="space-y-2 p-3 rounded bg-muted/30">
          <p className="text-sm font-mono text-foreground">{formatTime(direction.timestamp)}</p>
          <p className="text-sm font-semibold text-foreground">{data.percent}%</p>
          <p className="text-xs text-muted-foreground">{data.notes}</p>
        </div>
      )
    }
  }

  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <h3 className="text-xl font-bold mb-4 uppercase tracking-wide">{label}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-2">CURRENT</p>
          {renderLightingData(current)}
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-2">NEXT</p>
          {renderLightingData(next)}
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="pt-3 border-t border-border">
        {timeToNext !== null ? (
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground mb-2">TIME TO NEXT CHANGE</p>
            <p className="text-4xl font-bold font-mono">{formatTime(timeToNext)}</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground">No more changes</p>
          </div>
        )}
      </div>
    </div>
  )
}
