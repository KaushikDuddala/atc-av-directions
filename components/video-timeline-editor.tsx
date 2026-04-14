"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Play, Pause, Plus, Trash2, Copy, ZoomIn, ZoomOut, ChevronDown, ChevronUp, Sun, Zap } from "lucide-react"
import type { Direction } from "@/lib/types"
import { formatTimeMMSS } from "@/lib/time-utils"

interface VideoTimelineEditorProps {
  duration: number
  directions: Direction[]
  onDirectionsChange: (directions: Direction[]) => void
  currentTime: number
  onSeek: (time: number) => void
  isPlaying: boolean
  onPlayPause: () => void
  selectedTimestamp?: number
  onSelectCue: (timestamp: number | undefined) => void
}

const MIN_CUE_DURATION = 1000
const DEFAULT_CUE_DURATION = 5000
const TRACK_HEIGHT = 56
const RULER_HEIGHT = 28

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

type DragState = 
  | { type: "none" }
  | { type: "move"; index: number; offsetX: number }
  | { type: "resize-left"; index: number; offsetX: number }
  | { type: "resize-right"; index: number; offsetX: number }
  | { type: "playhead"; startX: number }

export function VideoTimelineEditor({
  duration,
  directions,
  onDirectionsChange,
  currentTime,
  onSeek,
  isPlaying,
  onPlayPause,
  selectedTimestamp,
  onSelectCue,
}: VideoTimelineEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineScrollRef = useRef<HTMLDivElement>(null)

  const [zoom, setZoom] = useState(1)
  const [drag, setDrag] = useState<DragState>({ type: "none" })
  const [panelOpen, setPanelOpen] = useState(true)

  // State refs for fast access during drag without triggering re-renders
  const dragRef = useRef<DragState>({ type: "none" })
  const directionsRef = useRef(directions)
  const zoomRef = useRef(zoom)

  useEffect(() => {
    dragRef.current = drag
  }, [drag])

  useEffect(() => {
    directionsRef.current = directions
  }, [directions])

  useEffect(() => {
    zoomRef.current = zoom
  }, [zoom])

  // Zoom calculation
  useEffect(() => {
    if (!timelineScrollRef.current || duration === 0) return
    const width = timelineScrollRef.current.clientWidth - 48
    setZoom(Math.max(0.04, width / duration))
  }, [duration])

  const timelineWidth = useMemo(() => duration * zoom, [duration, zoom])
  const timeToX = useCallback((ms: number) => ms * zoom, [zoom])
  const xToTime = useCallback((x: number) => Math.round(x / zoom), [zoom])

  // Auto-scroll to current time
  useEffect(() => {
    if (!timelineScrollRef.current) return
    const x = timeToX(currentTime)
    const { scrollLeft, clientWidth } = timelineScrollRef.current
    if (x < scrollLeft + 20 || x > scrollLeft + clientWidth - 20) {
      timelineScrollRef.current.scrollLeft = Math.max(0, x - clientWidth / 2)
    }
  }, [currentTime, timeToX])

  // Selected cue by timestamp
  const selectedCue = useMemo(
    () => directions.find((c) => c.startTime === selectedTimestamp),
    [directions, selectedTimestamp],
  )

  // Current active cue at playhead
  const currentCue = useMemo(() => {
    const sorted = [...directions].sort((a, b) => b.startTime - a.startTime)
    return sorted.find((c) => c.startTime <= currentTime) || null
  }, [directions, currentTime])

  // Ruler markers
  const rulerMarkers = useMemo(() => {
    const pxPerSec = zoom * 1000
    const intervals = [0.25, 0.5, 1, 2, 5, 10, 15, 30, 60]
    const interval = (intervals.find((v) => v * pxPerSec >= 60) || 60) * 1000
    const marks: number[] = []
    for (let t = 0; t <= duration; t += interval) marks.push(t)
    return marks
  }, [duration, zoom])

  // Mouse move handler - uses refs to avoid closure issues
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const currentDrag = dragRef.current
      if (currentDrag.type === "none" || !timelineScrollRef.current) return

      const rect = timelineScrollRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left + timelineScrollRef.current.scrollLeft
      const currentZoom = zoomRef.current

      if (currentDrag.type === "playhead") {
        const time = Math.round(x / currentZoom)
        onSeek(clamp(time, 0, duration))
        return
      }

      const deltaX = x - currentDrag.offsetX
      const deltaMs = Math.round(deltaX / currentZoom)
      const allCues = directionsRef.current
      const cue = allCues[currentDrag.index]
      if (!cue) return

      let updated: Direction[] = []

      if (currentDrag.type === "move") {
        const newStart = cue.startTime + deltaMs
        const newEnd = cue.endTime + deltaMs

        // Check boundaries with neighboring cues
        const sorted = [...allCues].sort((a, b) => a.startTime - b.startTime)
        const idx = sorted.findIndex((c) => c === cue)
        const prevEnd = idx > 0 ? sorted[idx - 1].endTime : 0
        const nextStart = idx < sorted.length - 1 ? sorted[idx + 1].startTime : duration

        const minStart = prevEnd
        const maxStart = nextStart - (cue.endTime - cue.startTime)
        const clampedStart = clamp(newStart, minStart, maxStart)
        const clampedEnd = clampedStart + (cue.endTime - cue.startTime)

        updated = allCues.map((c) =>
          c === cue ? { ...c, startTime: clampedStart, endTime: clampedEnd } : c,
        )
      } else if (currentDrag.type === "resize-left") {
        const newStart = cue.startTime + deltaMs
        const minStart = (allCues.filter((c) => c.endTime <= cue.startTime).sort((a, b) => b.endTime - a.endTime)[0]?.endTime) || 0
        const maxStart = cue.endTime - MIN_CUE_DURATION
        const clampedStart = clamp(newStart, minStart, maxStart)

        updated = allCues.map((c) => (c === cue ? { ...c, startTime: clampedStart } : c))
      } else if (currentDrag.type === "resize-right") {
        const newEnd = cue.endTime + deltaMs
        const maxEnd = (allCues.filter((c) => c.startTime >= cue.endTime).sort((a, b) => a.startTime - b.startTime)[0]?.startTime) || duration
        const minEnd = cue.startTime + MIN_CUE_DURATION
        const clampedEnd = clamp(newEnd, minEnd, maxEnd)

        updated = allCues.map((c) => (c === cue ? { ...c, endTime: clampedEnd } : c))
      }

      if (updated.length > 0) {
        onDirectionsChange(updated.sort((a, b) => a.startTime - b.startTime))
      }
    },
    [duration, onSeek, onDirectionsChange],
  )

  const handleMouseUp = useCallback(() => {
    setDrag({ type: "none" })
  }, [])

  // Register global mouse listeners
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  // Keyboard delete handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedCue) {
        e.preventDefault()
        onDirectionsChange(directions.filter((c) => c !== selectedCue))
        onSelectCue(undefined)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedCue, directions, onDirectionsChange, onSelectCue])

  // Zoom with mouse wheel
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (!timelineScrollRef.current?.contains(e.target as Node)) return
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      setZoom((z) => Math.max(0.02, Math.min(5, z * (e.deltaY < 0 ? 1.1 : 0.9))))
    }
    window.addEventListener("wheel", handler, { passive: false })
    return () => window.removeEventListener("wheel", handler, { passive: false } as any)
  }, [])

  // Handle ruler click to seek
  const handleRulerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!timelineScrollRef.current) return
    setDrag({ type: "playhead", startX: e.clientX })
  }

  // Handle track click to add cue
  const handleTrackClick = (e: React.MouseEvent) => {
    if (drag.type !== "none" || !timelineScrollRef.current) return
    const rect = timelineScrollRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left + timelineScrollRef.current.scrollLeft
    const timestamp = clamp(xToTime(x), 0, duration)

    // Check if already occupied
    if (directions.some((c) => timestamp >= c.startTime && timestamp < c.endTime)) return

    const endTime = Math.max(timestamp + DEFAULT_CUE_DURATION, timestamp + MIN_CUE_DURATION)
    const newCue: Direction = {
      startTime: timestamp,
      endTime: Math.min(endTime, duration),
      floodlight: { percent: 50, color: "#ffaa00", notes: "" },
      overhead: { percent: 50, notes: "" },
    }

    const newDirections = [...directions, newCue].sort((a, b) => a.startTime - b.startTime)
    onDirectionsChange(newDirections)
    onSelectCue(newCue.startTime)
  }

  // Handle cue mouse down to start drag
  const handleCueMouseDown = (e: React.MouseEvent, index: number, mode: "move" | "resize-left" | "resize-right") => {
    e.preventDefault()
    e.stopPropagation()
    const cue = directions[index]
    if (!cue) return
    onSelectCue(cue.startTime)

    if (!timelineScrollRef.current) return
    const rect = timelineScrollRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left + timelineScrollRef.current.scrollLeft

    if (mode === "move") {
      setDrag({ type: "move", index, offsetX })
    } else if (mode === "resize-left") {
      setDrag({ type: "resize-left", index, offsetX })
    } else if (mode === "resize-right") {
      setDrag({ type: "resize-right", index, offsetX })
    }
  }

  // Handle cue copy
  const handleDuplicateCue = (index: number) => {
    const cue = directions[index]
    if (!cue) return
    const newCue: Direction = {
      ...cue,
      startTime: cue.endTime,
      endTime: Math.min(cue.endTime + (cue.endTime - cue.startTime), duration),
    }
    const newDirections = [...directions, newCue].sort((a, b) => a.startTime - b.startTime)
    onDirectionsChange(newDirections)
    onSelectCue(newCue.startTime)
  }

  // Handle cue delete
  const handleDeleteCue = (index: number) => {
    const cue = directions[index]
    if (!cue) return
    onDirectionsChange(directions.filter((c) => c !== cue))
    onSelectCue(undefined)
  }

  // Update cue property
  const handleUpdateCue = (index: number, updater: (cue: Direction) => Direction) => {
    if (!selectedCue || selectedCue.startTime === undefined) return
    const updated = directions.map((c) => (c === selectedCue ? updater(c) : c))
    onDirectionsChange(updated)
  }

  // Lighting beams
  const floodlightBeams = currentCue
    ? [
        `radial-gradient(circle at 0% 0%, ${currentCue.floodlight.color}${Math.round((currentCue.floodlight.percent / 100) * 180)
          .toString(16)
          .padStart(2, "0")} 0%, transparent 36%)`,
        `radial-gradient(circle at 100% 0%, ${currentCue.floodlight.color}${Math.round((currentCue.floodlight.percent / 100) * 180)
          .toString(16)
          .padStart(2, "0")} 0%, transparent 36%)`,
        `radial-gradient(circle at 0% 100%, ${currentCue.floodlight.color}${Math.round((currentCue.floodlight.percent / 100) * 180)
          .toString(16)
          .padStart(2, "0")} 0%, transparent 36%)`,
        `radial-gradient(circle at 100% 100%, ${currentCue.floodlight.color}${Math.round((currentCue.floodlight.percent / 100) * 180)
          .toString(16)
          .padStart(2, "0")} 0%, transparent 36%)`,
      ].join(", ")
    : "none"

  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0f] text-white select-none"
    >
      {/* Lighting Preview */}
      <div
        className="relative h-44 flex-shrink-0 overflow-hidden"
        style={{ background: "#050507", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{
            background: [
              `radial-gradient(circle at 0% 0%, rgba(160,180,255,${((currentCue?.overhead.percent ?? 0) / 100) * 0.28}) 0%, transparent 38%)`,
              `radial-gradient(circle at 100% 0%, rgba(160,180,255,${((currentCue?.overhead.percent ?? 0) / 100) * 0.28}) 0%, transparent 38%)`,
              `radial-gradient(circle at 0% 100%, rgba(160,180,255,${((currentCue?.overhead.percent ?? 0) / 100) * 0.28}) 0%, transparent 38%)`,
              `radial-gradient(circle at 100% 100%, rgba(160,180,255,${((currentCue?.overhead.percent ?? 0) / 100) * 0.28}) 0%, transparent 38%)`,
            ].join(", "),
          }}
        />
        {currentCue && <div className="absolute inset-0 transition-all duration-300" style={{ background: floodlightBeams }} />}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
          }}
        />
        <div className="absolute top-4 left-5 flex gap-4">
          <Meter label="OVERHEAD" value={currentCue?.overhead.percent ?? 0} color="#8ab4ff" />
          <Meter label="FLOOD" value={currentCue?.floodlight.percent ?? 0} color={currentCue?.floodlight.color ?? "#ffaa00"} />
          {currentCue && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">Color</span>
              <div className="h-8 w-10 rounded-sm border border-white/10" style={{ backgroundColor: currentCue.floodlight.color }} />
            </div>
          )}
        </div>
        <div className="absolute bottom-4 right-5 text-right">
          <div className="text-2xl font-bold leading-none tracking-tight text-white/90">{formatTimeMMSS(currentTime)}</div>
          <div className="mt-0.5 text-xs font-medium text-white/60">/ {formatTimeMMSS(duration)}</div>
        </div>
        {!currentCue && <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">No cue active</span>
        </div>}
      </div>

      {/* Controls */}
      <div className="flex flex-shrink-0 items-center gap-3 px-4 py-2" style={{ background: "#111114", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={onPlayPause}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-all"
          style={{ background: isPlaying ? "#ef4444" : "#2563eb", color: "#fff" }}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {isPlaying ? "STOP" : "PLAY"}
        </button>

        <div className="h-5 w-px bg-white/10" />

        <button
          onClick={() => {
            const timestamp = currentTime
            if (!directions.some((c) => timestamp >= c.startTime && timestamp < c.endTime)) {
              const endTime = Math.max(timestamp + DEFAULT_CUE_DURATION, timestamp + MIN_CUE_DURATION)
              const newCue: Direction = {
                startTime: timestamp,
                endTime: Math.min(endTime, duration),
                floodlight: { percent: 50, color: "#ffaa00", notes: "" },
                overhead: { percent: 50, notes: "" },
              }
              const newDirections = [...directions, newCue].sort((a, b) => a.startTime - b.startTime)
              onDirectionsChange(newDirections)
              onSelectCue(newCue.startTime)
            }
          }}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-white/85 transition-all hover:bg-white/10 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          ADD CUE
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.max(0.02, z * 0.75))} className="rounded p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white" title="Zoom out">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <div className="w-16 text-center text-xs font-medium tabular-nums text-white/70">{Math.round(zoom * 1000)}px/s</div>
          <button onClick={() => setZoom((z) => Math.min(5, z * 1.33))} className="rounded p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white" title="Zoom in">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="text-xs font-medium tabular-nums text-white/65">
          {directions.length} cue{directions.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Track labels */}
        <div className="flex w-28 flex-shrink-0 flex-col" style={{ background: "#0d0d0f", borderRight: "1px solid rgba(255,255,white,0.06)" }}>
          <div style={{ height: RULER_HEIGHT, borderBottom: "1px solid rgba(255,255,white,0.06)" }} />
          <div
            className="flex items-center gap-2 px-3"
            style={{ height: TRACK_HEIGHT, borderBottom: "1px solid rgba(255,255,white,0.06)" }}
          >
            <Zap className="h-3 w-3 flex-shrink-0 text-yellow-400/70" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/85">Flood</span>
          </div>
          <div className="flex items-center gap-2 px-3" style={{ height: TRACK_HEIGHT }}>
            <Sun className="h-3 w-3 flex-shrink-0 text-blue-300/70" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/85">Over</span>
          </div>
        </div>

        {/* Timeline scrollable area */}
        <div ref={timelineScrollRef} className="relative flex-1 overflow-x-auto overflow-y-hidden" style={{ cursor: drag.type === "none" ? "default" : "grabbing" }}>
          <div style={{ width: timelineWidth + 80, position: "relative" }}>
            {/* Ruler */}
            <div
              className="sticky top-0 z-30"
              style={{ height: RULER_HEIGHT, background: "#111114", borderBottom: "1px solid rgba(255,255,white,0.08)" }}
              onMouseDown={handleRulerMouseDown}
            >
              {rulerMarkers.map((time) => (
                <div key={time} className="absolute top-0 flex flex-col items-start" style={{ left: timeToX(time) }}>
                  <div className="w-px bg-white/20" style={{ height: time % 5000 === 0 ? 10 : 6, marginTop: "auto" }} />
                  {time % 1000 === 0 && (
                    <span className="absolute top-2 left-1 text-[11px] font-medium tabular-nums text-white/70">
                      {formatTimeMMSS(time)}
                    </span>
                  )}
                </div>
              ))}
              <div className="pointer-events-none absolute top-0 z-40" style={{ left: timeToX(currentTime), transform: "translateX(-50%)" }}>
                <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "8px solid #ef4444" }} />
              </div>
            </div>

            {/* Floodlight track */}
            <TrackRow height={TRACK_HEIGHT} color="rgba(234,179,8,0.08)" onClick={handleTrackClick}>
              {directions.map((cue, index) => (
                <CueBlock
                  key={`${cue.startTime}-${cue.endTime}-flood`}
                  cue={cue}
                  type="flood"
                  timeToX={timeToX}
                  trackHeight={TRACK_HEIGHT}
                  isSelected={selectedCue === cue}
                  onMouseDownMove={(e) => handleCueMouseDown(e, index, "move")}
                  onMouseDownLeft={(e) => handleCueMouseDown(e, index, "resize-left")}
                  onMouseDownRight={(e) => handleCueMouseDown(e, index, "resize-right")}
                />
              ))}
            </TrackRow>

            {/* Overhead track */}
            <TrackRow height={TRACK_HEIGHT} color="rgba(96,165,250,0.06)" onClick={handleTrackClick}>
              {directions.map((cue, index) => (
                <CueBlock
                  key={`${cue.startTime}-${cue.endTime}-overhead`}
                  cue={cue}
                  type="overhead"
                  timeToX={timeToX}
                  trackHeight={TRACK_HEIGHT}
                  isSelected={selectedCue === cue}
                  onMouseDownMove={(e) => handleCueMouseDown(e, index, "move")}
                  onMouseDownLeft={(e) => handleCueMouseDown(e, index, "resize-left")}
                  onMouseDownRight={(e) => handleCueMouseDown(e, index, "resize-right")}
                />
              ))}
            </TrackRow>

            {/* Playhead line */}
            <div className="pointer-events-none absolute top-0 bottom-0 z-20" style={{ left: timeToX(currentTime), width: 1, background: "#ef4444", boxShadow: "0 0 6px #ef4444aa" }} />
          </div>
        </div>
      </div>

      {/* Inspector panel */}
      {selectedCue && (
        <div className="flex-shrink-0" style={{ background: "#111114", borderTop: "1px solid rgba(255,255,white,0.08)" }}>
          <div className="flex cursor-pointer items-center gap-3 px-4 py-2" onClick={() => setPanelOpen(!panelOpen)}>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/85">Cue Inspector</span>
            <span className="text-xs font-medium tabular-nums text-white/65">
              {formatTimeMMSS(selectedCue.startTime)} → {formatTimeMMSS(selectedCue.endTime)}
            </span>
            <div className="flex-1" />
            <button
              onClick={(e) => {
                e.stopPropagation()
                const idx = directions.indexOf(selectedCue)
                if (idx !== -1) handleDuplicateCue(idx)
              }}
              className="rounded p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                const idx = directions.indexOf(selectedCue)
                if (idx !== -1) handleDeleteCue(idx)
              }}
              className="rounded p-1 text-white/40 transition-colors hover:bg-red-500/20 hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            {panelOpen ? <ChevronDown className="h-3.5 w-3.5 text-white/70" /> : <ChevronUp className="h-3.5 w-3.5 text-white/70" />}
          </div>

          {panelOpen && (
            <div className="grid grid-cols-2 gap-4 px-4 pb-4">
              <InspectorPanel
                label="Floodlight"
                accent="#eab308"
                showColor
                colorValue={selectedCue.floodlight.color}
                onColorChange={(color) =>
                  handleUpdateCue(directions.indexOf(selectedCue), (c) => ({ ...c, floodlight: { ...c.floodlight, color } }))
                }
                percent={selectedCue.floodlight.percent}
                onPercentChange={(percent) =>
                  handleUpdateCue(directions.indexOf(selectedCue), (c) => ({ ...c, floodlight: { ...c.floodlight, percent } }))
                }
                notes={selectedCue.floodlight.notes ?? ""}
                onNotesChange={(notes) =>
                  handleUpdateCue(directions.indexOf(selectedCue), (c) => ({ ...c, floodlight: { ...c.floodlight, notes } }))
                }
              />
              <InspectorPanel
                label="Overhead"
                accent="#60a5fa"
                percent={selectedCue.overhead.percent}
                onPercentChange={(percent) =>
                  handleUpdateCue(directions.indexOf(selectedCue), (c) => ({ ...c, overhead: { ...c.overhead, percent } }))
                }
                notes={selectedCue.overhead.notes ?? ""}
                onNotesChange={(notes) =>
                  handleUpdateCue(directions.indexOf(selectedCue), (c) => ({ ...c, overhead: { ...c.overhead, notes } }))
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TrackRow({
  height,
  color,
  children,
  onClick,
}: {
  height: number
  color: string
  children: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void
}) {
  return (
    <div className="relative" style={{ height, background: color, borderBottom: "1px solid rgba(255,255,white,0.04)", cursor: "crosshair" }} onClick={onClick}>
      {children}
    </div>
  )
}

function CueBlock({
  cue,
  type,
  timeToX,
  trackHeight,
  isSelected,
  onMouseDownMove,
  onMouseDownLeft,
  onMouseDownRight,
}: {
  cue: Direction
  type: "flood" | "overhead"
  timeToX: (ms: number) => number
  trackHeight: number
  isSelected: boolean
  onMouseDownMove: (event: React.MouseEvent) => void
  onMouseDownLeft: (event: React.MouseEvent) => void
  onMouseDownRight: (event: React.MouseEvent) => void
}) {
  const left = timeToX(cue.startTime)
  const width = Math.max(12, timeToX(cue.endTime) - timeToX(cue.startTime))
  const isFlood = type === "flood"
  const baseColor = isFlood ? cue.floodlight.color : "#7aa2f7"
  const percent = isFlood ? cue.floodlight.percent : cue.overhead.percent

  function getLuminance(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return 0.299 * r + 0.587 * g + 0.114 * b
  }

  const textDark = getLuminance(baseColor) > 150

  return (
    <div
      className="group absolute top-1 rounded-sm"
      style={{
        left,
        width,
        height: trackHeight - 8,
        background: isSelected ? `linear-gradient(135deg, ${baseColor}cc, ${baseColor}88)` : `${baseColor}55`,
        border: `1px solid ${isSelected ? baseColor : `${baseColor}88`}`,
        boxShadow: isSelected ? `0 0 12px ${baseColor}55, inset 0 0 8px ${baseColor}22` : "none",
        cursor: "grab",
        overflow: "hidden",
        zIndex: isSelected ? 10 : 5,
        transition: "box-shadow 0.1s",
      }}
      onMouseDown={onMouseDownMove}
    >
      <div
        className="absolute left-0 top-0 bottom-0 transition-colors hover:bg-white/20"
        style={{ width: 8, cursor: "ew-resize" }}
        onMouseDown={onMouseDownLeft}
      >
        <div className="absolute left-1 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-white/80" />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-3">
        {width > 40 && (
          <span className="truncate text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: isSelected ? (textDark ? "#000" : "#fff") : "rgba(255,255,white,0.92)" }}>
            {percent}%
          </span>
        )}
      </div>

      <div
        className="absolute right-0 top-0 bottom-0 transition-colors hover:bg-white/20"
        style={{ width: 8, cursor: "ew-resize" }}
        onMouseDown={onMouseDownRight}
      >
        <div className="absolute right-1 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-white/80" />
      </div>
    </div>
  )
}

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">{label}</span>
      <div className="flex items-end gap-2">
        <div className="flex items-end gap-0.5" style={{ height: 28 }}>
          {[...Array(10)].map((_, index) => {
            const threshold = (index + 1) * 10
            const active = value >= threshold
            return (
              <div
                key={index}
                className="w-1.5 rounded-sm transition-all duration-100"
                style={{
                  height: 6 + index * 2,
                  background: active ? color : "rgba(255,255,white,0.08)",
                  boxShadow: active ? `0 0 4px ${color}88` : "none",
                }}
              />
            )
          })}
        </div>
        <span className="text-sm font-semibold tabular-nums text-white">
          {value}
          <span className="text-[10px] text-white/65">%</span>
        </span>
      </div>
    </div>
  )
}

function InspectorPanel({
  label,
  accent,
  showColor,
  colorValue,
  onColorChange,
  percent,
  onPercentChange,
  notes,
  onNotesChange,
}: {
  label: string
  accent: string
  showColor?: boolean
  colorValue?: string
  onColorChange?: (value: string) => void
  percent: number
  onPercentChange: (value: number) => void
  notes: string
  onNotesChange: (value: string) => void
}) {
  return (
    <div style={{ background: "#0a0a0c", border: "1px solid #1e1e2a", borderRadius: 6, padding: "9px 11px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: accent, marginBottom: 9 }}>{label}</div>
      {showColor && colorValue && onColorChange && (
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,white,0.75)", width: 38 }}>COLOR</span>
          <input type="color" value={colorValue} onChange={(event) => onColorChange(event.target.value)} style={{ width: 28, height: 20, border: "none", borderRadius: 3, cursor: "pointer", background: "transparent" }} />
          <code style={{ fontSize: 11, color: "rgba(255,255,white,0.82)" }}>{colorValue}</code>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,white,0.75)", width: 38 }}>LEVEL</span>
        <input type="range" min={0} max={100} value={percent} onChange={(event) => onPercentChange(Number(event.target.value))} style={{ flex: 1, accentColor: accent, cursor: "pointer" }} />
        <span style={{ fontSize: 14, fontWeight: 700, width: 40, textAlign: "right", color: accent }}>{percent}%</span>
      </div>
      <input
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        placeholder={`${label} notes...`}
        style={{
          width: "100%",
          marginTop: 8,
          background: "#0a0a0c",
          border: "1px solid #2a2a3a",
          borderRadius: 5,
          color: "rgba(255,255,white,0.95)",
          fontSize: 13,
          fontWeight: 500,
          padding: "7px 10px",
          fontFamily: "inherit",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  )
}
"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Play, Pause, Plus, Trash2, Copy, ZoomIn, ZoomOut, ChevronDown, ChevronUp, Sun, Zap } from "lucide-react"
import type { Direction } from "@/lib/types"
import { formatTimeMMSS } from "@/lib/time-utils"

interface VideoTimelineEditorProps {
  duration: number
  directions: Direction[]
  onDirectionsChange: (directions: Direction[]) => void
  currentTime: number
  onSeek: (time: number) => void
  isPlaying: boolean
  onPlayPause: () => void
  selectedTimestamp?: number
  onSelectCue: (timestamp: number | undefined) => void
}

const MIN_CUE_DURATION = 1000
const DEFAULT_CUE_DURATION = 5000
const TRACK_HEIGHT = 56
const RULER_HEIGHT = 28
const HANDLE_WIDTH = 8

// Internal type with stable unique ID
type InternalCue = Direction & { __id: string }

type DragState =
  | { type: "none" }
  | { type: "move"; cueId: string; currentStartTime: number; currentEndTime: number; startX: number }
  | { type: "resize-left"; cueId: string; currentStartTime: number; startX: number }
  | { type: "resize-right"; cueId: string; currentEndTime: number; startX: number }
  | { type: "playhead"; startX: number }

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

// UUID helper
function uuid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// Convert directions to internal format with stable IDs
function primeInternalCues(directions: Direction[], existing: InternalCue[]): InternalCue[] {
  const map = new Map(existing.map((c) => [`${c.startTime}:${c.endTime}`, c.__id]))
  return directions
    .slice()
    .sort((a, b) => a.startTime - b.startTime)
    .map((dir) => ({
      ...dir,
      __id: map.get(`${dir.startTime}:${dir.endTime}`) || uuid(),
    }))
}

// Convert back to public format
function toCues(internal: InternalCue[]): Direction[] {
  return internal.map(({ __id: _id, ...dir }) => dir)
}

// Pure functions for cue operations
function canAddCueAt(cues: InternalCue[], timestamp: number): boolean {
  return !cues.some((c) => timestamp >= c.startTime && timestamp < c.endTime)
}

function addCue(cues: InternalCue[], timestamp: number, duration: number): InternalCue[] | null {
  if (!canAddCueAt(cues, timestamp)) return null

  const sorted = [...cues].sort((a, b) => a.startTime - b.startTime)
  const nextCue = sorted.find((c) => c.startTime > timestamp)
  const maxEnd = nextCue ? nextCue.startTime : duration
  const endTime = Math.min(timestamp + DEFAULT_CUE_DURATION, maxEnd, duration)

  if (endTime - timestamp < MIN_CUE_DURATION) return null

  const newCue: InternalCue = {
    __id: uuid(),
    startTime: timestamp,
    endTime: endTime,
    floodlight: { percent: 50, color: "#ffaa00", notes: "" },
    overhead: { percent: 50, notes: "" },
  }

  return [...cues, newCue].sort((a, b) => a.startTime - b.startTime)
}

function deleteCue(cues: InternalCue[], cueId: string): InternalCue[] {
  return cues.filter((c) => c.__id !== cueId)
}

function duplicateCue(cues: InternalCue[], cueId: string, duration: number): InternalCue[] | null {
  const cue = cues.find((c) => c.__id === cueId)
  if (!cue) return null
  return addCue(cues, cue.endTime, duration)
}

function moveCue(cues: InternalCue[], cueId: string, newStart: number, newEnd: number, duration: number): InternalCue[] {
  const sorted = [...cues].sort((a, b) => a.startTime - b.startTime)
  const index = sorted.findIndex((c) => c.__id === cueId)
  if (index === -1) return cues

  const cue = sorted[index]
  const prevEnd = index > 0 ? sorted[index - 1].endTime : 0
  const nextStart = index < sorted.length - 1 ? sorted[index + 1].startTime : duration

  const minStart = prevEnd
  const maxStart = nextStart - (newEnd - newStart)
  const clampedStart = clamp(newStart, minStart, maxStart)
  const clampedEnd = clampedStart + (newEnd - newStart)

  return cues
    .map((c) => (c.__id === cueId ? { ...c, startTime: clampedStart, endTime: clampedEnd } : c))
    .sort((a, b) => a.startTime - b.startTime)
}

function resizeLeft(cues: InternalCue[], cueId: string, newStart: number): InternalCue[] {
  const sorted = [...cues].sort((a, b) => a.startTime - b.startTime)
  const index = sorted.findIndex((c) => c.__id === cueId)
  if (index === -1) return cues

  const cue = sorted[index]
  const prevEnd = index > 0 ? sorted[index - 1].endTime : 0
  const minStart = prevEnd
  const maxStart = cue.endTime - MIN_CUE_DURATION
  const clampedStart = clamp(newStart, minStart, maxStart)

  return cues
    .map((c) => (c.__id === cueId ? { ...c, startTime: clampedStart } : c))
    .sort((a, b) => a.startTime - b.startTime)
}

function resizeRight(cues: InternalCue[], cueId: string, newEnd: number, duration: number): InternalCue[] {
  const sorted = [...cues].sort((a, b) => a.startTime - b.startTime)
  const index = sorted.findIndex((c) => c.__id === cueId)
  if (index === -1) return cues

  const cue = sorted[index]
  const nextStart = index < sorted.length - 1 ? sorted[index + 1].startTime : duration
  const minEnd = cue.startTime + MIN_CUE_DURATION
  const maxEnd = nextStart
  const clampedEnd = clamp(newEnd, minEnd, maxEnd)

  return cues
    .map((c) => (c.__id === cueId ? { ...c, endTime: clampedEnd } : c))
    .sort((a, b) => a.startTime - b.startTime)
}

function updateCue(cues: InternalCue[], cueId: string, updater: (cue: InternalCue) => InternalCue): InternalCue[] {
  return cues.map((c) => (c.__id === cueId ? updater(c) : c))
}

export function VideoTimelineEditor({
  duration,
  directions,
  onDirectionsChange,
  currentTime,
  onSeek,
  isPlaying,
  onPlayPause,
  selectedTimestamp,
  onSelectCue,
}: VideoTimelineEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineScrollRef = useRef<HTMLDivElement>(null)
  
  // Refs to avoid stale closures during drag
  const cuesRef = useRef<InternalCue[]>([])
  const dragRef = useRef<DragState>({ type: "none" })

  const [zoom, setZoom] = useState(1)
  const [drag, setDrag] = useState<DragState>({ type: "none" })
  const [panelOpen, setPanelOpen] = useState(true)
  const [cues, setCues] = useState<InternalCue[]>([])

  // Keep refs in sync with state
  useEffect(() => {
    cuesRef.current = cues
  }, [cues])
  
  useEffect(() => {
    dragRef.current = drag
  }, [drag])

  // Initialize and sync cues when directions change from parent
  useEffect(() => {
    setCues((prev) => primeInternalCues(directions, prev))
  }, [directions])

  // Notify parent when cues change locally
  const syncToParent = useCallback((newCues: InternalCue[]) => {
    setCues(newCues)
    onDirectionsChange(toCues(newCues))
  }, [onDirectionsChange])

  // Zoom calculation
  useEffect(() => {
    if (!timelineScrollRef.current || duration === 0) return
    const width = timelineScrollRef.current.clientWidth - 48
    setZoom(Math.max(0.04, width / duration))
  }, [duration])

  const timelineWidth = useMemo(() => duration * zoom, [duration, zoom])
  const timeToX = useCallback((ms: number) => ms * zoom, [zoom])
  const xToTime = useCallback((x: number) => Math.round(x / zoom), [zoom])

  // Auto-scroll to current time
  useEffect(() => {
    if (!timelineScrollRef.current) return
    const x = timeToX(currentTime)
    const { scrollLeft, clientWidth } = timelineScrollRef.current
    if (x < scrollLeft + 20 || x > scrollLeft + clientWidth - 20) {
      timelineScrollRef.current.scrollLeft = Math.max(0, x - clientWidth / 2)
    }
  }, [currentTime, timeToX])

  // Get the currently selected cue
  const selectedCue = useMemo(() => {
    if (selectedTimestamp === undefined) return null
    return cues.find((c) => c.startTime === selectedTimestamp) || null
  }, [cues, selectedTimestamp])

  // Get the current active cue at playhead
  const currentCue = useMemo(() => {
    const sorted = [...cues].sort((a, b) => b.startTime - a.startTime)
    return sorted.find((c) => c.startTime <= currentTime) || null
  }, [cues, currentTime])

  // Handle cue operations
  const handleAddCue = useCallback(
    (timestamp: number) => {
      const newCues = addCue(cues, timestamp, duration)
      if (newCues) {
        syncToParent(newCues)
        const added = newCues.find((c) => c.startTime === timestamp)
        if (added) onSelectCue(added.startTime)
      }
    },
    [cues, duration, syncToParent, onSelectCue],
  )

  const handleDeleteCue = useCallback(
    (cueId: string) => {
      syncToParent(deleteCue(cues, cueId))
      onSelectCue(undefined)
    },
    [cues, syncToParent, onSelectCue],
  )

  const handleDuplicateCue = useCallback(
    (cueId: string) => {
      const newCues = duplicateCue(cues, cueId, duration)
      if (newCues) {
        syncToParent(newCues)
        const dup = newCues.find((c) => c.__id !== cueId && c.startTime >= (cues.find((x) => x.__id === cueId)?.endTime || 0))
        if (dup) onSelectCue(dup.startTime)
      }
    },
    [cues, duration, syncToParent, onSelectCue],
  )

  const handleUpdateCue = useCallback(
    (cueId: string, updater: (cue: InternalCue) => InternalCue) => {
      syncToParent(updateCue(cues, cueId, updater))
    },
    [cues, syncToParent],
  )

  // Get syncToParent that always uses current cues
  const syncToParentRef = useRef(syncToParent)
  useEffect(() => {
    syncToParentRef.current = syncToParent
  }, [syncToParent])

  // Mouse move for drag operations - uses refs to avoid recreating function on cues change
  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      const currentDrag = dragRef.current
      if (currentDrag.type === "none" || !timelineScrollRef.current) return

      const rect = timelineScrollRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left + timelineScrollRef.current.scrollLeft
      const deltaX = x - currentDrag.startX
      const deltaMs = xToTime(deltaX)

      if (currentDrag.type === "playhead") {
        onSeek(clamp(xToTime(x), 0, duration))
        return
      }

      if (Math.abs(deltaX) < 2) return // Ignore tiny movements

      const currentCues = cuesRef.current
      
      if (currentDrag.type === "move") {
        const newStart = currentDrag.currentStartTime + deltaMs
        const newEnd = currentDrag.currentEndTime + deltaMs
        syncToParentRef.current(moveCue(currentCues, currentDrag.cueId, newStart, newEnd, duration))
      } else if (currentDrag.type === "resize-left") {
        const newStart = currentDrag.currentStartTime + deltaMs
        syncToParentRef.current(resizeLeft(currentCues, currentDrag.cueId, newStart))
      } else if (currentDrag.type === "resize-right") {
        const newEnd = currentDrag.currentEndTime + deltaMs
        syncToParentRef.current(resizeRight(currentCues, currentDrag.cueId, newEnd, duration))
      }
    },
    [xToTime, duration, onSeek],
  )

  const onMouseUp = useCallback(() => {
    setDrag({ type: "none" })
  }, [])

  // Register mouse listeners
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  // Keyboard handler for Delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedCue) {
        e.preventDefault()
        handleDeleteCue(selectedCue.__id)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedCue, handleDeleteCue])

  // Zoom with mouse wheel
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (!timelineScrollRef.current?.contains(e.target as Node)) return
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      setZoom((z) => Math.max(0.02, Math.min(5, z * (e.deltaY < 0 ? 1.1 : 0.9))))
    }
    window.addEventListener("wheel", handler, { passive: false })
    return () => window.removeEventListener("wheel", handler, { passive: false } as any)
  }, [])

  // Ruler markers
  const rulerMarkers = useMemo(() => {
    const pxPerSec = zoom * 1000
    const intervals = [0.25, 0.5, 1, 2, 5, 10, 15, 30, 60]
    const interval = (intervals.find((v) => v * pxPerSec >= 60) || 60) * 1000
    const marks: number[] = []
    for (let t = 0; t <= duration; t += interval) marks.push(t)
    return marks
  }, [duration, zoom])

  // Drag start handlers
  const handleRulerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (!timelineScrollRef.current) return
      const rect = timelineScrollRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left + timelineScrollRef.current.scrollLeft
      onSeek(clamp(xToTime(x), 0, duration))
      setDrag({ type: "playhead", startX: e.clientX })
    },
    [duration, onSeek, xToTime],
  )

  const handleCueMouseDown = useCallback(
    (e: React.MouseEvent, cueId: string, dragType: "move" | "resize-left" | "resize-right") => {
      e.preventDefault()
      e.stopPropagation()
      const cue = cuesRef.current.find((c) => c.__id === cueId)
      if (!cue) return
      onSelectCue(cue.startTime)
      if (dragType === "move") {
        setDrag({
          type: "move",
          cueId,
          currentStartTime: cue.startTime,
          currentEndTime: cue.endTime,
          startX: e.clientX,
        })
      } else if (dragType === "resize-left") {
        setDrag({
          type: "resize-left",
          cueId,
          currentStartTime: cue.startTime,
          startX: e.clientX,
        })
      } else if (dragType === "resize-right") {
        setDrag({
          type: "resize-right",
          cueId,
          currentEndTime: cue.endTime,
          startX: e.clientX,
        })
      }
    },
    [onSelectCue],
  )

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (drag.type !== "none" || !timelineScrollRef.current) return
      const rect = timelineScrollRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left + timelineScrollRef.current.scrollLeft
      const timestamp = clamp(xToTime(x), 0, duration)
      handleAddCue(timestamp)
    },
    [drag.type, xToTime, duration, handleAddCue],
  )

  // Lighting beams
  const floodlightBeams = currentCue
    ? [
        `radial-gradient(circle at 0% 0%, ${currentCue.floodlight.color}${Math.round((currentCue.floodlight.percent / 100) * 180)
          .toString(16)
          .padStart(2, "0")} 0%, transparent 36%)`,
        `radial-gradient(circle at 100% 0%, ${currentCue.floodlight.color}${Math.round((currentCue.floodlight.percent / 100) * 180)
          .toString(16)
          .padStart(2, "0")} 0%, transparent 36%)`,
        `radial-gradient(circle at 0% 100%, ${currentCue.floodlight.color}${Math.round((currentCue.floodlight.percent / 100) * 180)
          .toString(16)
          .padStart(2, "0")} 0%, transparent 36%)`,
        `radial-gradient(circle at 100% 100%, ${currentCue.floodlight.color}${Math.round((currentCue.floodlight.percent / 100) * 180)
          .toString(16)
          .padStart(2, "0")} 0%, transparent 36%)`,
      ].join(", ")
    : "none"

  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0f] text-white select-none"
    >
      <div
        className="relative h-44 flex-shrink-0 overflow-hidden"
        style={{ background: "#050507", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{
            background: [
              `radial-gradient(circle at 0% 0%, rgba(160,180,255,${((currentCue?.overhead.percent ?? 0) / 100) * 0.28}) 0%, transparent 38%)`,
              `radial-gradient(circle at 100% 0%, rgba(160,180,255,${((currentCue?.overhead.percent ?? 0) / 100) * 0.28}) 0%, transparent 38%)`,
              `radial-gradient(circle at 0% 100%, rgba(160,180,255,${((currentCue?.overhead.percent ?? 0) / 100) * 0.28}) 0%, transparent 38%)`,
              `radial-gradient(circle at 100% 100%, rgba(160,180,255,${((currentCue?.overhead.percent ?? 0) / 100) * 0.28}) 0%, transparent 38%)`,
            ].join(", "),
          }}
        />
        {currentCue && <div className="absolute inset-0 transition-all duration-300" style={{ background: floodlightBeams }} />}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
          }}
        />
        <div className="absolute top-4 left-5 flex gap-4">
          <Meter label="OVERHEAD" value={currentCue?.overhead.percent ?? 0} color="#8ab4ff" />
          <Meter label="FLOOD" value={currentCue?.floodlight.percent ?? 0} color={currentCue?.floodlight.color ?? "#ffaa00"} />
          {currentCue && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">Color</span>
              <div className="h-8 w-10 rounded-sm border border-white/10" style={{ backgroundColor: currentCue.floodlight.color }} />
            </div>
          )}
        </div>
        <div className="absolute bottom-4 right-5 text-right">
          <div className="text-2xl font-bold leading-none tracking-tight text-white/90">{formatTimeMMSS(currentTime)}</div>
          <div className="mt-0.5 text-xs font-medium text-white/60">/ {formatTimeMMSS(duration)}</div>
        </div>
        {!currentCue && <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">No cue active</span>
        </div>}
      </div>

      <div className="flex flex-shrink-0 items-center gap-3 px-4 py-2" style={{ background: "#111114", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={onPlayPause}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-all"
          style={{ background: isPlaying ? "#ef4444" : "#2563eb", color: "#fff" }}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {isPlaying ? "STOP" : "PLAY"}
        </button>

        <div className="h-5 w-px bg-white/10" />

        <button
          onClick={() => handleAddCue(currentTime)}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-white/85 transition-all hover:bg-white/10 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          ADD CUE
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.max(0.02, z * 0.75))} className="rounded p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white" title="Zoom out">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <div className="w-16 text-center text-xs font-medium tabular-nums text-white/70">{Math.round(zoom * 1000)}px/s</div>
          <button onClick={() => setZoom((z) => Math.min(5, z * 1.33))} className="rounded p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white" title="Zoom in">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="text-xs font-medium tabular-nums text-white/65">
          {cues.length} cue{cues.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex w-28 flex-shrink-0 flex-col" style={{ background: "#0d0d0f", borderRight: "1px solid rgba(255,255,white,0.06)" }}>
          <div style={{ height: RULER_HEIGHT, borderBottom: "1px solid rgba(255,255,white,0.06)" }} />
          <div
            className="flex items-center gap-2 px-3"
            style={{ height: TRACK_HEIGHT, borderBottom: "1px solid rgba(255,255,white,0.06)" }}
          >
            <Zap className="h-3 w-3 flex-shrink-0 text-yellow-400/70" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/85">Flood</span>
          </div>
          <div className="flex items-center gap-2 px-3" style={{ height: TRACK_HEIGHT }}>
            <Sun className="h-3 w-3 flex-shrink-0 text-blue-300/70" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/85">Over</span>
          </div>
        </div>

        <div ref={timelineScrollRef} className="relative flex-1 overflow-x-auto overflow-y-hidden" style={{ cursor: drag.type === "none" ? "default" : "grabbing" }}>
          <div style={{ width: timelineWidth + 80, position: "relative" }}>
            <div
              className="sticky top-0 z-30"
              style={{ height: RULER_HEIGHT, background: "#111114", borderBottom: "1px solid rgba(255,255,white,0.08)" }}
              onMouseDown={handleRulerMouseDown}
            >
              {rulerMarkers.map((time) => (
                <div key={time} className="absolute top-0 flex flex-col items-start" style={{ left: timeToX(time) }}>
                  <div className="w-px bg-white/20" style={{ height: time % 5000 === 0 ? 10 : 6, marginTop: "auto" }} />
                  {time % 1000 === 0 && (
                    <span className="absolute top-2 left-1 text-[11px] font-medium tabular-nums text-white/70">
                      {formatTimeMMSS(time)}
                    </span>
                  )}
                </div>
              ))}
              <div className="pointer-events-none absolute top-0 z-40" style={{ left: timeToX(currentTime), transform: "translateX(-50%)" }}>
                <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "8px solid #ef4444" }} />
              </div>
            </div>

            <TrackRow height={TRACK_HEIGHT} color="rgba(234,179,8,0.08)" onClick={handleTrackClick}>
              {cues.map((cue) => (
                <CueBlock
                  key={cue.__id}
                  cue={cue}
                  type="flood"
                  timeToX={timeToX}
                  trackHeight={TRACK_HEIGHT}
                  isSelected={selectedCue?.__id === cue.__id}
                  onMouseDownMove={(e) => handleCueMouseDown(e, cue.__id, "move")}
                  onMouseDownLeft={(e) => handleCueMouseDown(e, cue.__id, "resize-left")}
                  onMouseDownRight={(e) => handleCueMouseDown(e, cue.__id, "resize-right")}
                />
              ))}
            </TrackRow>

            <TrackRow height={TRACK_HEIGHT} color="rgba(96,165,250,0.06)" onClick={handleTrackClick}>
              {cues.map((cue) => (
                <CueBlock
                  key={cue.__id}
                  cue={cue}
                  type="overhead"
                  timeToX={timeToX}
                  trackHeight={TRACK_HEIGHT}
                  isSelected={selectedCue?.__id === cue.__id}
                  onMouseDownMove={(e) => handleCueMouseDown(e, cue.__id, "move")}
                  onMouseDownLeft={(e) => handleCueMouseDown(e, cue.__id, "resize-left")}
                  onMouseDownRight={(e) => handleCueMouseDown(e, cue.__id, "resize-right")}
                />
              ))}
            </TrackRow>

            <div className="pointer-events-none absolute top-0 bottom-0 z-20" style={{ left: timeToX(currentTime), width: 1, background: "#ef4444", boxShadow: "0 0 6px #ef4444aa" }} />
          </div>
        </div>
      </div>

      {selectedCue && (
        <div className="flex-shrink-0" style={{ background: "#111114", borderTop: "1px solid rgba(255,255,white,0.08)" }}>
          <div className="flex cursor-pointer items-center gap-3 px-4 py-2" onClick={() => setPanelOpen(!panelOpen)}>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/85">Cue Inspector</span>
            <span className="text-xs font-medium tabular-nums text-white/65">
              {formatTimeMMSS(selectedCue.startTime)} → {formatTimeMMSS(selectedCue.endTime)}
            </span>
            <div className="flex-1" />
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDuplicateCue(selectedCue.__id)
              }}
              className="rounded p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteCue(selectedCue.__id)
              }}
              className="rounded p-1 text-white/40 transition-colors hover:bg-red-500/20 hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            {panelOpen ? <ChevronDown className="h-3.5 w-3.5 text-white/70" /> : <ChevronUp className="h-3.5 w-3.5 text-white/70" />}
          </div>

          {panelOpen && (
            <div className="grid grid-cols-2 gap-4 px-4 pb-4">
              <InspectorPanel
                label="Floodlight"
                accent="#eab308"
                showColor
                colorValue={selectedCue.floodlight.color}
                onColorChange={(color) =>
                  handleUpdateCue(selectedCue.__id, (c) => ({ ...c, floodlight: { ...c.floodlight, color } }))
                }
                percent={selectedCue.floodlight.percent}
                onPercentChange={(percent) =>
                  handleUpdateCue(selectedCue.__id, (c) => ({ ...c, floodlight: { ...c.floodlight, percent } }))
                }
                notes={selectedCue.floodlight.notes ?? ""}
                onNotesChange={(notes) => handleUpdateCue(selectedCue.__id, (c) => ({ ...c, floodlight: { ...c.floodlight, notes } }))}
              />
              <InspectorPanel
                label="Overhead"
                accent="#60a5fa"
                percent={selectedCue.overhead.percent}
                onPercentChange={(percent) =>
                  handleUpdateCue(selectedCue.__id, (c) => ({ ...c, overhead: { ...c.overhead, percent } }))
                }
                notes={selectedCue.overhead.notes ?? ""}
                onNotesChange={(notes) => handleUpdateCue(selectedCue.__id, (c) => ({ ...c, overhead: { ...c.overhead, notes } }))}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TrackRow({
  height,
  color,
  children,
  onClick,
}: {
  height: number
  color: string
  children: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void
}) {
  return (
    <div className="relative" style={{ height, background: color, borderBottom: "1px solid rgba(255,255,white,0.04)", cursor: "crosshair" }} onClick={onClick}>
      {children}
    </div>
  )
}

function CueBlock({
  cue,
  type,
  timeToX,
  trackHeight,
  isSelected,
  onMouseDownMove,
  onMouseDownLeft,
  onMouseDownRight,
}: {
  cue: InternalCue
  type: "flood" | "overhead"
  timeToX: (ms: number) => number
  trackHeight: number
  isSelected: boolean
  onMouseDownMove: (event: React.MouseEvent) => void
  onMouseDownLeft: (event: React.MouseEvent) => void
  onMouseDownRight: (event: React.MouseEvent) => void
}) {
  const left = timeToX(cue.startTime)
  const width = Math.max(12, timeToX(cue.endTime) - timeToX(cue.startTime))
  const isFlood = type === "flood"
  const baseColor = isFlood ? cue.floodlight.color : "#7aa2f7"
  const percent = isFlood ? cue.floodlight.percent : cue.overhead.percent

  function getLuminance(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return 0.299 * r + 0.587 * g + 0.114 * b
  }

  const textDark = getLuminance(baseColor) > 150

  return (
    <div
      className="group absolute top-1 rounded-sm"
      style={{
        left,
        width,
        height: trackHeight - 8,
        background: isSelected ? `linear-gradient(135deg, ${baseColor}cc, ${baseColor}88)` : `${baseColor}55`,
        border: `1px solid ${isSelected ? baseColor : `${baseColor}88`}`,
        boxShadow: isSelected ? `0 0 12px ${baseColor}55, inset 0 0 8px ${baseColor}22` : "none",
        cursor: "grab",
        overflow: "hidden",
        zIndex: isSelected ? 10 : 5,
        transition: "box-shadow 0.1s",
      }}
      onMouseDown={onMouseDownMove}
    >
      <div
        className="absolute left-0 top-0 bottom-0 transition-colors hover:bg-white/20"
        style={{ width: 8, cursor: "ew-resize" }}
        onMouseDown={onMouseDownLeft}
      >
        <div className="absolute left-1 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-white/80" />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-3">
        {width > 40 && (
          <span className="truncate text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: isSelected ? (textDark ? "#000" : "#fff") : "rgba(255,255,white,0.92)" }}>
            {percent}%
          </span>
        )}
      </div>

      <div
        className="absolute right-0 top-0 bottom-0 transition-colors hover:bg-white/20"
        style={{ width: 8, cursor: "ew-resize" }}
        onMouseDown={onMouseDownRight}
      >
        <div className="absolute right-1 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-white/80" />
      </div>
    </div>
  )
}

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">{label}</span>
      <div className="flex items-end gap-2">
        <div className="flex items-end gap-0.5" style={{ height: 28 }}>
          {[...Array(10)].map((_, index) => {
            const threshold = (index + 1) * 10
            const active = value >= threshold
            return (
              <div
                key={index}
                className="w-1.5 rounded-sm transition-all duration-100"
                style={{
                  height: 6 + index * 2,
                  background: active ? color : "rgba(255,255,white,0.08)",
                  boxShadow: active ? `0 0 4px ${color}88` : "none",
                }}
              />
            )
          })}
        </div>
        <span className="text-sm font-semibold tabular-nums text-white">
          {value}
          <span className="text-[10px] text-white/65">%</span>
        </span>
      </div>
    </div>
  )
}

function InspectorPanel({
  label,
  accent,
  showColor,
  colorValue,
  onColorChange,
  percent,
  onPercentChange,
  notes,
  onNotesChange,
}: {
  label: string
  accent: string
  showColor?: boolean
  colorValue?: string
  onColorChange?: (value: string) => void
  percent: number
  onPercentChange: (value: number) => void
  notes: string
  onNotesChange: (value: string) => void
}) {
  return (
    <div style={{ background: "#0a0a0c", border: "1px solid #1e1e2a", borderRadius: 6, padding: "9px 11px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: accent, marginBottom: 9 }}>{label}</div>
      {showColor && colorValue && onColorChange && (
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,white,0.75)", width: 38 }}>COLOR</span>
          <input type="color" value={colorValue} onChange={(event) => onColorChange(event.target.value)} style={{ width: 28, height: 20, border: "none", borderRadius: 3, cursor: "pointer", background: "transparent" }} />
          <code style={{ fontSize: 11, color: "rgba(255,255,white,0.82)" }}>{colorValue}</code>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,white,0.75)", width: 38 }}>LEVEL</span>
        <input type="range" min={0} max={100} value={percent} onChange={(event) => onPercentChange(Number(event.target.value))} style={{ flex: 1, accentColor: accent, cursor: "pointer" }} />
        <span style={{ fontSize: 14, fontWeight: 700, width: 40, textAlign: "right", color: accent }}>{percent}%</span>
      </div>
      <input
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        placeholder={`${label} notes...`}
        style={{
          width: "100%",
          marginTop: 8,
          background: "#0a0a0c",
          border: "1px solid #2a2a3a",
          borderRadius: 5,
          color: "rgba(255,255,white,0.95)",
          fontSize: 13,
          fontWeight: 500,
          padding: "7px 10px",
          fontFamily: "inherit",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  )
}
