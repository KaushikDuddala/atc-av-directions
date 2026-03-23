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

const MIN_CUE_DURATION = 500
const DEFAULT_CUE_DURATION = 5000
const TRACK_HEIGHT = 56
const RULER_HEIGHT = 28
const HANDLE_WIDTH = 8

type EditorCue = Direction & { localId: string }

type DragState =
  | { type: "none" }
  | { type: "move"; cueId: string; mouseStartX: number }
  | { type: "resize-left"; cueId: string; mouseStartX: number }
  | { type: "resize-right"; cueId: string; mouseStartX: number }
  | { type: "playhead"; mouseStartX: number }

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

function withLocalIds(directions: Direction[]): EditorCue[] {
  return directions
    .slice()
    .sort((a, b) => a.startTime - b.startTime)
    .map((direction, index) => ({
      ...direction,
      localId: `${direction.startTime}-${direction.endTime}-${index}`,
    }))
}

function stripLocalIds(directions: EditorCue[]): Direction[] {
  return directions
    .slice()
    .sort((a, b) => a.startTime - b.startTime)
    .map(({ localId: _localId, ...direction }) => direction)
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function getLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function findCueIndexAtTime(cues: EditorCue[], timestamp: number) {
  return cues.findIndex((cue) => timestamp >= cue.startTime && timestamp < cue.endTime)
}

function sortCues(cues: EditorCue[]) {
  return [...cues].sort((a, b) => a.startTime - b.startTime)
}

function getCueNeighbors(cues: EditorCue[], cueId: string) {
  const sorted = sortCues(cues)
  const index = sorted.findIndex((cue) => cue.localId === cueId)
  return {
    sorted,
    index,
    cue: index >= 0 ? sorted[index] : null,
    prev: index > 0 ? sorted[index - 1] : null,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null,
  }
}

function createCue(cues: EditorCue[], timestamp: number, duration: number): EditorCue[] | null {
  if (findCueIndexAtTime(cues, timestamp) !== -1) return null

  const sorted = sortCues(cues)
  const next = sorted.find((cue) => cue.startTime > timestamp) ?? null
  const maxEnd = next ? next.startTime : duration
  const endTime = Math.min(timestamp + DEFAULT_CUE_DURATION, maxEnd, duration)
  if (endTime - timestamp < MIN_CUE_DURATION) return null

  const nextCue: EditorCue = {
    localId: `cue-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    startTime: timestamp,
    endTime,
    floodlight: {
      percent: 50,
      color: "#ffaa00",
      notes: "",
    },
    overhead: {
      percent: 50,
      notes: "",
    },
  }

  return sortCues([...cues, nextCue])
}

function duplicateCue(cues: EditorCue[], cueId: string, duration: number): EditorCue[] | null {
  const { cue } = getCueNeighbors(cues, cueId)
  if (!cue) return null
  return createCue(cues, cue.endTime, duration)
}

function moveCue(cues: EditorCue[], cueId: string, proposedStart: number, duration: number): EditorCue[] {
  const { cue, prev, next } = getCueNeighbors(cues, cueId)
  if (!cue) return cues

  const cueDuration = cue.endTime - cue.startTime
  const minStart = prev ? prev.endTime : 0
  const maxStart = next ? next.startTime - cueDuration : duration - cueDuration
  const startTime = clamp(proposedStart, minStart, Math.max(minStart, maxStart))
  const endTime = startTime + cueDuration

  return sortCues(
    cues.map((item) => (item.localId === cueId ? { ...item, startTime, endTime } : item)),
  )
}

function resizeCueLeft(cues: EditorCue[], cueId: string, proposedStart: number): EditorCue[] {
  const { cue, prev } = getCueNeighbors(cues, cueId)
  if (!cue) return cues

  const minStart = prev ? prev.endTime : 0
  const maxStart = cue.endTime - MIN_CUE_DURATION
  const startTime = clamp(proposedStart, minStart, maxStart)

  return sortCues(
    cues.map((item) => (item.localId === cueId ? { ...item, startTime } : item)),
  )
}

function resizeCueRight(cues: EditorCue[], cueId: string, proposedEnd: number, duration: number): EditorCue[] {
  const { cue, next } = getCueNeighbors(cues, cueId)
  if (!cue) return cues

  const minEnd = cue.startTime + MIN_CUE_DURATION
  const maxEnd = next ? next.startTime : duration
  const endTime = clamp(proposedEnd, minEnd, maxEnd)

  return sortCues(
    cues.map((item) => (item.localId === cueId ? { ...item, endTime } : item)),
  )
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

  const [zoom, setZoom] = useState(1)
  const [drag, setDrag] = useState<DragState>({ type: "none" })
  const [panelOpen, setPanelOpen] = useState(true)
  const [localDirections, setLocalDirections] = useState<EditorCue[]>(() => withLocalIds(directions))
  const [dragSnapshot, setDragSnapshot] = useState<EditorCue[]>([])

  useEffect(() => {
    if (drag.type === "none") {
      setLocalDirections(withLocalIds(directions))
    }
  }, [directions, drag.type])

  useEffect(() => {
    if (!timelineScrollRef.current || duration === 0) return
    const width = timelineScrollRef.current.clientWidth - 48
    setZoom(Math.max(0.04, width / duration))
  }, [duration])

  const timelineWidth = useMemo(() => duration * zoom, [duration, zoom])
  const timeToX = useCallback((ms: number) => ms * zoom, [zoom])
  const xToTime = useCallback((x: number) => Math.round(x / zoom), [zoom])

  useEffect(() => {
    if (!timelineScrollRef.current) return
    const x = timeToX(currentTime)
    const { scrollLeft, clientWidth } = timelineScrollRef.current
    if (x < scrollLeft + 20 || x > scrollLeft + clientWidth - 20) {
      timelineScrollRef.current.scrollLeft = Math.max(0, x - clientWidth / 2)
    }
  }, [currentTime, timeToX])

  const commitDirections = useCallback(
    (next: EditorCue[]) => {
      const sorted = sortCues(next)
      setLocalDirections(sorted)
      onDirectionsChange(stripLocalIds(sorted))
    },
    [onDirectionsChange],
  )

  const startDrag = useCallback(
    (event: React.MouseEvent, cue: EditorCue, type: "move" | "resize-left" | "resize-right") => {
      event.stopPropagation()
      event.preventDefault()
      onSelectCue(cue.startTime)
      setDragSnapshot(localDirections)
      setDrag({
        type,
        cueId: cue.localId,
        mouseStartX: event.clientX,
      })
    },
    [localDirections, onSelectCue],
  )

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (drag.type === "none") return

    if (drag.type === "playhead") {
      if (!timelineScrollRef.current) return
      const rect = timelineScrollRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left + timelineScrollRef.current.scrollLeft
      onSeek(clamp(xToTime(x), 0, duration))
      return
    }

    const deltaMs = xToTime(event.clientX - drag.mouseStartX)
    const base = dragSnapshot.length > 0 ? dragSnapshot : localDirections
    const activeCue = base.find((cue) => cue.localId === drag.cueId)
    if (!activeCue) return

    let next = base
    if (drag.type === "move") {
      next = moveCue(base, drag.cueId, activeCue.startTime + deltaMs, duration)
    } else if (drag.type === "resize-left") {
      next = resizeCueLeft(base, drag.cueId, activeCue.startTime + deltaMs)
    } else if (drag.type === "resize-right") {
      next = resizeCueRight(base, drag.cueId, activeCue.endTime + deltaMs, duration)
    }

    setLocalDirections(next)
    const movedCue = next.find((cue) => cue.localId === drag.cueId)
    onSelectCue(movedCue?.startTime)
  }, [drag, dragSnapshot, duration, localDirections, onSeek, onSelectCue, xToTime])

  const onMouseUp = useCallback(() => {
    if (drag.type !== "none" && drag.type !== "playhead") {
      commitDirections(localDirections)
    }
    setDrag({ type: "none" })
    setDragSnapshot([])
  }, [commitDirections, drag.type, localDirections])

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  useEffect(() => {
    const element = timelineScrollRef.current
    if (!element) return
    const handler = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault()
        setZoom((value) => Math.max(0.02, Math.min(5, value * (event.deltaY < 0 ? 1.1 : 0.9))))
      }
    }
    element.addEventListener("wheel", handler, { passive: false })
    return () => element.removeEventListener("wheel", handler)
  }, [])

  const handleRulerMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineScrollRef.current) return
    const rect = timelineScrollRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left + timelineScrollRef.current.scrollLeft
    onSeek(clamp(xToTime(x), 0, duration))
    setDrag({ type: "playhead", mouseStartX: event.clientX })
  }, [duration, onSeek, xToTime])

  const handleTrackClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (drag.type !== "none" || !timelineScrollRef.current) return
    const rect = timelineScrollRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left + timelineScrollRef.current.scrollLeft
    const timestamp = clamp(xToTime(x), 0, duration)
    const next = createCue(localDirections, timestamp, duration)
    if (!next) return
    commitDirections(next)
    const created = next.find((cue) => cue.startTime === timestamp)
    onSelectCue(created?.startTime)
  }, [commitDirections, drag.type, duration, localDirections, onSelectCue, xToTime])

  const handleAddCueAtPlayhead = useCallback(() => {
    const next = createCue(localDirections, currentTime, duration)
    if (!next) return
    commitDirections(next)
    const created = next.find((cue) => cue.startTime === currentTime)
    onSelectCue(created?.startTime)
  }, [commitDirections, currentTime, duration, localDirections, onSelectCue])

  const rulerMarkers = useMemo(() => {
    const pxPerSec = zoom * 1000
    const intervals = [0.25, 0.5, 1, 2, 5, 10, 15, 30, 60]
    const interval = (intervals.find((value) => value * pxPerSec >= 60) || 60) * 1000
    const marks: number[] = []
    for (let time = 0; time <= duration; time += interval) marks.push(time)
    return marks
  }, [duration, zoom])

  const currentDirection = useMemo(() => {
    const sorted = [...localDirections].sort((a, b) => b.startTime - a.startTime)
    return sorted.find((cue) => cue.startTime <= currentTime) || null
  }, [currentTime, localDirections])

  const selectedCue = useMemo(
    () => (selectedTimestamp !== undefined ? localDirections.find((cue) => cue.startTime === selectedTimestamp) ?? null : null),
    [localDirections, selectedTimestamp],
  )

  const handleDeleteCue = useCallback((cueId: string) => {
    const next = localDirections.filter((cue) => cue.localId !== cueId)
    commitDirections(next)
    onSelectCue(undefined)
  }, [commitDirections, localDirections, onSelectCue])

  const handleDuplicateCue = useCallback((cueId: string) => {
    const next = duplicateCue(localDirections, cueId, duration)
    if (!next) return
    commitDirections(next)
    const duplicated = next.find((cue, index, cues) => index > 0 && cues[index - 1].localId === cueId)
    onSelectCue(duplicated?.startTime)
  }, [commitDirections, duration, localDirections, onSelectCue])

  const updateCue = useCallback((cueId: string, updater: (cue: EditorCue) => EditorCue) => {
    const next = sortCues(localDirections.map((cue) => (cue.localId === cueId ? updater(cue) : cue)))
    commitDirections(next)
    const updated = next.find((cue) => cue.localId === cueId)
    onSelectCue(updated?.startTime)
  }, [commitDirections, localDirections, onSelectCue])

  const floodlightBeams = currentDirection
    ? [
        `radial-gradient(circle at 0% 0%, ${currentDirection.floodlight.color}${Math.round(currentDirection.floodlight.percent / 100 * 180).toString(16).padStart(2, "0")} 0%, transparent 36%)`,
        `radial-gradient(circle at 100% 0%, ${currentDirection.floodlight.color}${Math.round(currentDirection.floodlight.percent / 100 * 180).toString(16).padStart(2, "0")} 0%, transparent 36%)`,
        `radial-gradient(circle at 0% 100%, ${currentDirection.floodlight.color}${Math.round(currentDirection.floodlight.percent / 100 * 180).toString(16).padStart(2, "0")} 0%, transparent 36%)`,
        `radial-gradient(circle at 100% 100%, ${currentDirection.floodlight.color}${Math.round(currentDirection.floodlight.percent / 100 * 180).toString(16).padStart(2, "0")} 0%, transparent 36%)`,
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
              `radial-gradient(circle at 0% 0%, rgba(160,180,255,${(currentDirection?.overhead.percent ?? 0) / 100 * 0.28}) 0%, transparent 38%)`,
              `radial-gradient(circle at 100% 0%, rgba(160,180,255,${(currentDirection?.overhead.percent ?? 0) / 100 * 0.28}) 0%, transparent 38%)`,
              `radial-gradient(circle at 0% 100%, rgba(160,180,255,${(currentDirection?.overhead.percent ?? 0) / 100 * 0.28}) 0%, transparent 38%)`,
              `radial-gradient(circle at 100% 100%, rgba(160,180,255,${(currentDirection?.overhead.percent ?? 0) / 100 * 0.28}) 0%, transparent 38%)`,
            ].join(", "),
          }}
        />
        {currentDirection && (
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{ background: floodlightBeams }}
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
          }}
        />

        <div className="absolute top-4 left-5 flex gap-4">
          <Meter label="OVERHEAD" value={currentDirection?.overhead.percent ?? 0} color="#8ab4ff" />
          <Meter label="FLOOD" value={currentDirection?.floodlight.percent ?? 0} color={currentDirection?.floodlight.color ?? "#ffaa00"} />
          {currentDirection && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">Color</span>
              <div className="h-8 w-10 rounded-sm border border-white/10" style={{ backgroundColor: currentDirection.floodlight.color }} />
            </div>
          )}
        </div>

        <div className="absolute bottom-4 right-5 text-right">
          <div className="text-2xl font-bold leading-none tracking-tight text-white/90">{formatTimeMMSS(currentTime)}</div>
          <div className="mt-0.5 text-xs font-medium text-white/60">/ {formatTimeMMSS(duration)}</div>
        </div>

        {!currentDirection && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">No cue active</span>
          </div>
        )}
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
          onClick={handleAddCueAtPlayhead}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-white/85 transition-all hover:bg-white/10 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          ADD CUE
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((value) => Math.max(0.02, value * 0.75))} className="rounded p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white" title="Zoom out">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <div className="w-16 text-center text-xs font-medium tabular-nums text-white/70">
            {Math.round(zoom * 1000)}px/s
          </div>
          <button onClick={() => setZoom((value) => Math.min(5, value * 1.33))} className="rounded p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white" title="Zoom in">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="text-xs font-medium tabular-nums text-white/65">
          {localDirections.length} cue{localDirections.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex w-28 flex-shrink-0 flex-col" style={{ background: "#0d0d0f", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ height: RULER_HEIGHT, borderBottom: "1px solid rgba(255,255,255,0.06)" }} />
          <div className="flex items-center gap-2 px-3" style={{ height: TRACK_HEIGHT, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
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
              style={{ height: RULER_HEIGHT, background: "#111114", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              onMouseDown={handleRulerMouseDown}
            >
              {rulerMarkers.map((time) => (
                <div key={time} className="absolute top-0 flex flex-col items-start" style={{ left: timeToX(time) }}>
                  <div className="w-px bg-white/20" style={{ height: time % 5000 === 0 ? 10 : 6, marginTop: "auto" }} />
                  {time % 1000 === 0 && (
                    <span className="absolute bottom-1 left-1 text-[11px] font-medium tabular-nums text-white/70">
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
              {localDirections.map((cue) => (
                <CueBlock
                  key={cue.localId}
                  cue={cue}
                  type="flood"
                  timeToX={timeToX}
                  trackHeight={TRACK_HEIGHT}
                  isSelected={selectedCue?.localId === cue.localId}
                  onMouseDownMove={(event) => startDrag(event, cue, "move")}
                  onMouseDownLeft={(event) => startDrag(event, cue, "resize-left")}
                  onMouseDownRight={(event) => startDrag(event, cue, "resize-right")}
                />
              ))}
            </TrackRow>

            <TrackRow height={TRACK_HEIGHT} color="rgba(96,165,250,0.06)" onClick={handleTrackClick}>
              {localDirections.map((cue) => (
                <CueBlock
                  key={cue.localId}
                  cue={cue}
                  type="overhead"
                  timeToX={timeToX}
                  trackHeight={TRACK_HEIGHT}
                  isSelected={selectedCue?.localId === cue.localId}
                  onMouseDownMove={(event) => startDrag(event, cue, "move")}
                  onMouseDownLeft={(event) => startDrag(event, cue, "resize-left")}
                  onMouseDownRight={(event) => startDrag(event, cue, "resize-right")}
                />
              ))}
            </TrackRow>

            <div className="pointer-events-none absolute top-0 bottom-0 z-20" style={{ left: timeToX(currentTime), width: 1, background: "#ef4444", boxShadow: "0 0 6px #ef4444aa" }} />
          </div>
        </div>
      </div>

      {selectedCue && (
        <div className="flex-shrink-0" style={{ background: "#111114", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex cursor-pointer items-center gap-3 px-4 py-2" onClick={() => setPanelOpen((value) => !value)}>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/85">Cue Inspector</span>
            <span className="text-xs font-medium tabular-nums text-white/65">
              {formatTimeMMSS(selectedCue.startTime)} → {formatTimeMMSS(selectedCue.endTime)}
            </span>
            <div className="flex-1" />
            <button onClick={(event) => { event.stopPropagation(); handleDuplicateCue(selectedCue.localId) }} className="rounded p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white">
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button onClick={(event) => { event.stopPropagation(); handleDeleteCue(selectedCue.localId) }} className="rounded p-1 text-white/40 transition-colors hover:bg-red-500/20 hover:text-red-400">
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
                onColorChange={(color) => updateCue(selectedCue.localId, (cue) => ({ ...cue, floodlight: { ...cue.floodlight, color } }))}
                percent={selectedCue.floodlight.percent}
                onPercentChange={(percent) => updateCue(selectedCue.localId, (cue) => ({ ...cue, floodlight: { ...cue.floodlight, percent } }))}
                notes={selectedCue.floodlight.notes ?? ""}
                onNotesChange={(notes) => updateCue(selectedCue.localId, (cue) => ({ ...cue, floodlight: { ...cue.floodlight, notes } }))}
              />
              <InspectorPanel
                label="Overhead"
                accent="#60a5fa"
                percent={selectedCue.overhead.percent}
                onPercentChange={(percent) => updateCue(selectedCue.localId, (cue) => ({ ...cue, overhead: { ...cue.overhead, percent } }))}
                notes={selectedCue.overhead.notes ?? ""}
                onNotesChange={(notes) => updateCue(selectedCue.localId, (cue) => ({ ...cue, overhead: { ...cue.overhead, notes } }))}
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
    <div className="relative" style={{ height, background: color, borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "crosshair" }} onClick={onClick}>
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
  cue: EditorCue
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
      <div className="absolute left-0 top-0 bottom-0 transition-colors hover:bg-white/20" style={{ width: HANDLE_WIDTH, cursor: "ew-resize" }} onMouseDown={(event) => { event.stopPropagation(); onMouseDownLeft(event) }}>
        <div className="absolute left-1 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-white/80" />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-3">
        {width > 40 && (
          <span className="truncate text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: isSelected ? (textDark ? "#000" : "#fff") : "rgba(255,255,255,0.92)" }}>
            {percent}%
          </span>
        )}
      </div>

      <div className="absolute right-0 top-0 bottom-0 transition-colors hover:bg-white/20" style={{ width: HANDLE_WIDTH, cursor: "ew-resize" }} onMouseDown={(event) => { event.stopPropagation(); onMouseDownRight(event) }}>
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
                  background: active ? color : "rgba(255,255,255,0.08)",
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
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.75)", width: 38 }}>COLOR</span>
          <input type="color" value={colorValue} onChange={(event) => onColorChange(event.target.value)} style={{ width: 28, height: 20, border: "none", borderRadius: 3, cursor: "pointer", background: "transparent" }} />
          <code style={{ fontSize: 11, color: "rgba(255,255,255,0.82)" }}>{colorValue}</code>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.75)", width: 38 }}>LEVEL</span>
        <input type="range" min={0} max={100} value={percent} onChange={(event) => onPercentChange(Number(event.target.value))} style={{ flex: 1, accentColor: accent, cursor: "pointer" }} />
        <span style={{ fontSize: 14, fontWeight: 700, width: 40, textAlign: "right", color: accent }}>{percent}%</span>
      </div>
      <input value={notes} onChange={(event) => onNotesChange(event.target.value)} placeholder={`${label} notes...`} style={{ width: "100%", marginTop: 8, background: "#0a0a0c", border: "1px solid #2a2a3a", borderRadius: 5, color: "rgba(255,255,255,0.95)", fontSize: 13, fontWeight: 500, padding: "7px 10px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
    </div>
  )
}
