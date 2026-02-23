"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Play, Pause, Plus, Trash2, Copy, ZoomIn, ZoomOut, ChevronDown, ChevronUp, Sun, Zap } from "lucide-react"
import { Button } from "./ui/button"
import type { Direction } from "@/lib/types"
import { formatTimeMMSS } from "@/lib/time-utils"

interface VideoTimelineEditorProps {
  duration: number
  directions: Direction[]
  onAddCue: (timestamp: number) => void
  onUpdateCue: (cue: Direction) => void
  onDeleteCue: (timestamp: number) => void
  onDuplicateCue: (cue: Direction) => void
  currentTime: number
  onSeek: (time: number) => void
  isPlaying: boolean
  onPlayPause: () => void
  selectedTimestamp?: number
  onSelectCue: (timestamp: number) => void
}

const MIN_CUE_DURATION = 500 // ms
const TRACK_HEIGHT = 56
const RULER_HEIGHT = 28
const HANDLE_WIDTH = 8

type DragState =
  | { type: "none" }
  | { type: "move"; cueStart: number; mouseStartX: number; originalStart: number; originalEnd: number }
  | { type: "resize-left"; cueStart: number; mouseStartX: number; originalStart: number; originalEnd: number }
  | { type: "resize-right"; cueStart: number; mouseStartX: number; originalStart: number; originalEnd: number }
  | { type: "playhead"; mouseStartX: number }

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

export function VideoTimelineEditor({
  duration,
  directions,
  onAddCue,
  onUpdateCue,
  onDeleteCue,
  onDuplicateCue,
  currentTime,
  onSeek,
  isPlaying,
  onPlayPause,
  selectedTimestamp,
  onSelectCue,
}: VideoTimelineEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineScrollRef = useRef<HTMLDivElement>(null)
  const rulerRef = useRef<HTMLDivElement>(null)

  const [zoom, setZoom] = useState(1) // px per ms
  const [scrollLeft, setScrollLeft] = useState(0)
  const [drag, setDrag] = useState<DragState>({ type: "none" })
  const [panelOpen, setPanelOpen] = useState(true)
  const [localDirections, setLocalDirections] = useState<Direction[]>(directions)

  // Keep local copy in sync with prop (except during drag)
  useEffect(() => {
    if (drag.type === "none") setLocalDirections(directions)
  }, [directions, drag.type])

  // Compute pixel-per-ms zoom so the timeline fills the container initially
  useEffect(() => {
    if (!timelineScrollRef.current || duration === 0) return
    const w = timelineScrollRef.current.clientWidth - 48
    setZoom(Math.max(0.04, w / duration))
  }, [duration])

  const timelineWidth = useMemo(() => duration * zoom, [duration, zoom])

  const timeToX = useCallback((ms: number) => ms * zoom, [zoom])
  const xToTime = useCallback((x: number) => Math.round(x / zoom), [zoom])

  // Auto-scroll playhead into view
  useEffect(() => {
    if (!timelineScrollRef.current) return
    const x = timeToX(currentTime)
    const { scrollLeft: sl, clientWidth } = timelineScrollRef.current
    if (x < sl + 20 || x > sl + clientWidth - 20) {
      timelineScrollRef.current.scrollLeft = Math.max(0, x - clientWidth / 2)
    }
  }, [currentTime, timeToX])

  // ─── Cue collision resolution ──────────────────────────────────────────────
  function resolveCollisions(cues: Direction[], movingStart: number): Direction[] {
    // Sort by start time
    const sorted = [...cues].sort((a, b) => a.startTime - b.startTime)
    // Push cues right if they overlap (except the cue being moved keeps priority)
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]
      const curr = sorted[i]
      if (curr.startTime < prev.endTime) {
        const newStart = prev.endTime
        const dur = curr.endTime - curr.startTime
        sorted[i] = { ...curr, startTime: newStart, endTime: Math.min(newStart + dur, duration) }
      }
    }
    return sorted
  }

  // ─── Drag handling ─────────────────────────────────────────────────────────
  const startDrag = useCallback(
    (
      e: React.MouseEvent,
      cue: Direction,
      type: "move" | "resize-left" | "resize-right"
    ) => {
      e.stopPropagation()
      e.preventDefault()
      onSelectCue(cue.startTime)
      setDrag({
        type,
        cueStart: cue.startTime,
        mouseStartX: e.clientX,
        originalStart: cue.startTime,
        originalEnd: cue.endTime,
      })
    },
    [onSelectCue]
  )

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (drag.type === "none") return
      if (drag.type === "playhead") {
        if (!timelineScrollRef.current) return
        const rect = timelineScrollRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left + timelineScrollRef.current.scrollLeft
        onSeek(Math.max(0, Math.min(duration, xToTime(x))))
        return
      }

      const deltaX = e.clientX - drag.mouseStartX
      const deltaMs = xToTime(deltaX)

      setLocalDirections((prev) => {
        const cues = prev.map((c) => {
          if (c.startTime !== drag.cueStart && drag.type !== "move") return c

          // For move/resize find the right cue
          const origDur = drag.originalEnd - drag.originalStart

          if (drag.type === "move") {
            if (c.startTime !== drag.cueStart) return c
            const newStart = Math.max(0, Math.min(duration - origDur, drag.originalStart + deltaMs))
            return { ...c, startTime: newStart, endTime: newStart + origDur }
          }
          if (drag.type === "resize-left") {
            if (c.startTime !== drag.cueStart && c.startTime !== drag.originalStart + deltaMs) {
              // find by original start
              if (drag.originalStart !== c.startTime && c.startTime !== drag.cueStart) return c
            }
            if (c.startTime !== drag.cueStart) return c
            const newStart = Math.max(0, Math.min(drag.originalEnd - MIN_CUE_DURATION, drag.originalStart + deltaMs))
            return { ...c, startTime: newStart }
          }
          if (drag.type === "resize-right") {
            if (c.startTime !== drag.cueStart) return c
            const newEnd = Math.min(duration, Math.max(drag.originalStart + MIN_CUE_DURATION, drag.originalEnd + deltaMs))
            return { ...c, endTime: newEnd }
          }
          return c
        })
        return resolveCollisions(cues, drag.cueStart)
      })
    },
    [drag, duration, xToTime, onSeek]
  )

  const onMouseUp = useCallback(() => {
    if (drag.type === "none") return
    if (drag.type !== "playhead") {
      // Commit changes
      const moved = localDirections.find((c) => c.startTime === drag.cueStart || 
        // after move the startTime may have changed - find by matching original
        false
      )
      // Commit all changed cues
      localDirections.forEach((c) => {
        const original = directions.find((d) => d.startTime === c.startTime)
        if (!original || original.startTime !== c.startTime || original.endTime !== c.endTime) {
          onUpdateCue(c)
        }
      })
    }
    setDrag({ type: "none" })
  }, [drag, localDirections, directions, onUpdateCue])

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  // ─── Zoom with ctrl+scroll ─────────────────────────────────────────────────
  useEffect(() => {
    const el = timelineScrollRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        setZoom((z) => Math.max(0.02, Math.min(5, z * (e.deltaY < 0 ? 1.1 : 0.9))))
      }
    }
    el.addEventListener("wheel", handler, { passive: false })
    return () => el.removeEventListener("wheel", handler)
  }, [])

  // ─── Ruler click → seek ────────────────────────────────────────────────────
  const handleRulerMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!timelineScrollRef.current) return
      const rect = timelineScrollRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left + timelineScrollRef.current.scrollLeft
      onSeek(Math.max(0, Math.min(duration, xToTime(x))))
      setDrag({ type: "playhead", mouseStartX: e.clientX })
    },
    [duration, xToTime, onSeek]
  )

  // ─── Track click → add cue ─────────────────────────────────────────────────
  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (drag.type !== "none") return
      if (!timelineScrollRef.current) return
      const rect = timelineScrollRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left + timelineScrollRef.current.scrollLeft
      const t = Math.max(0, Math.min(duration, xToTime(x)))
      onAddCue(t)
    },
    [drag.type, duration, xToTime, onAddCue]
  )

  // ─── Ruler markers ─────────────────────────────────────────────────────────
  const rulerMarkers = useMemo(() => {
    const pxPerSec = zoom * 1000
    // pick interval so markers are at least 60px apart
    const intervals = [0.25, 0.5, 1, 2, 5, 10, 15, 30, 60]
    const interval = (intervals.find((i) => i * pxPerSec >= 60) || 60) * 1000
    const marks: number[] = []
    for (let t = 0; t <= duration; t += interval) marks.push(t)
    return marks
  }, [duration, zoom])

  // ─── Current lighting state for preview ───────────────────────────────────
  const currentDirection = useMemo(() => {
    const sorted = [...localDirections].sort((a, b) => b.startTime - a.startTime)
    return sorted.find((d) => d.startTime <= currentTime) || null
  }, [localDirections, currentTime])

  const selectedCue = useMemo(
    () => (selectedTimestamp !== undefined ? localDirections.find((d) => d.startTime === selectedTimestamp) ?? null : null),
    [localDirections, selectedTimestamp]
  )

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-[#0d0d0f] rounded-xl overflow-hidden border border-white/5 select-none"
      style={{ fontFamily: "'IBM Plex Mono', 'Fira Code', monospace" }}
    >

      {/* ── PREVIEW STRIP ─────────────────────────────────────────────────── */}
      <div
        className="relative flex-shrink-0 h-44 overflow-hidden"
        style={{
          background: "#050507",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Overhead ambient fill */}
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{
            background: `linear-gradient(180deg, rgba(160,180,255,${(currentDirection?.overhead.percent ?? 0) / 100 * 0.45}) 0%, transparent 100%)`,
          }}
        />
        {/* Floodlight radial */}
        {currentDirection && (
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${currentDirection.floodlight.color}${Math.round(currentDirection.floodlight.percent / 100 * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
            }}
          />
        )}
        {/* Scan-line overlay for retro tech feel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
          }}
        />

        {/* Meters */}
        <div className="absolute top-4 left-5 flex gap-4">
          <Meter label="OVERHEAD" value={currentDirection?.overhead.percent ?? 0} color="#8ab4ff" />
          <Meter
            label="FLOOD"
            value={currentDirection?.floodlight.percent ?? 0}
            color={currentDirection?.floodlight.color ?? "#ffaa00"}
          />
          {currentDirection && (
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-white/30 uppercase tracking-widest">Color</span>
              <div
                className="w-10 h-8 rounded-sm border border-white/10"
                style={{ backgroundColor: currentDirection.floodlight.color }}
              />
            </div>
          )}
        </div>

        {/* Time counter */}
        <div className="absolute bottom-4 right-5 text-right">
          <div className="text-2xl font-bold text-white/90 tracking-tight leading-none">
            {formatTimeMMSS(currentTime)}
          </div>
          <div className="text-[11px] text-white/25 mt-0.5">/ {formatTimeMMSS(duration)}</div>
        </div>

        {/* No-cue hint */}
        {!currentDirection && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] text-white/15 uppercase tracking-widest">No cue active</span>
          </div>
        )}
      </div>

      {/* ── TRANSPORT BAR ─────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-4 py-2"
        style={{ background: "#111114", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={onPlayPause}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all"
          style={{
            background: isPlaying ? "#ef4444" : "#2563eb",
            color: "#fff",
          }}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isPlaying ? "STOP" : "PLAY"}
        </button>

        <div className="w-px h-5 bg-white/10" />

        {/* Add cue at playhead */}
        <button
          onClick={() => onAddCue(currentTime)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all hover:bg-white/10 text-white/60 hover:text-white"
        >
          <Plus className="w-3.5 h-3.5" />
          ADD CUE
        </button>

        <div className="flex-1" />

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.02, z * 0.75))}
            className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <div
            className="text-[10px] text-white/30 w-14 text-center tabular-nums"
            style={{ fontFamily: "monospace" }}
          >
            {Math.round(zoom * 1000)}px/s
          </div>
          <button
            onClick={() => setZoom((z) => Math.min(5, z * 1.33))}
            className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[11px] text-white/25 tabular-nums">
          {localDirections.length} cue{localDirections.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── TIMELINE AREA ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Track labels */}
        <div
          className="flex-shrink-0 w-28 flex flex-col"
          style={{ background: "#0d0d0f", borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div style={{ height: RULER_HEIGHT, borderBottom: "1px solid rgba(255,255,255,0.06)" }} />
          {/* Flood track label */}
          <div
            className="flex items-center gap-2 px-3"
            style={{ height: TRACK_HEIGHT, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Zap className="w-3 h-3 text-yellow-400/70 flex-shrink-0" />
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Flood</span>
          </div>
          {/* Overhead track label */}
          <div
            className="flex items-center gap-2 px-3"
            style={{ height: TRACK_HEIGHT }}
          >
            <Sun className="w-3 h-3 text-blue-300/70 flex-shrink-0" />
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Over</span>
          </div>
        </div>

        {/* Scrollable timeline */}
        <div
          ref={timelineScrollRef}
          className="flex-1 overflow-x-auto overflow-y-hidden relative"
          style={{ cursor: drag.type === "none" ? "default" : "grabbing" }}
          onScroll={(e) => setScrollLeft(e.currentTarget.scrollLeft)}
        >
          <div style={{ width: timelineWidth + 80, position: "relative" }}>

            {/* Ruler */}
            <div
              className="sticky top-0 z-30"
              style={{ height: RULER_HEIGHT, background: "#111114", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              onMouseDown={handleRulerMouseDown}
            >
              {rulerMarkers.map((t) => (
                <div
                  key={t}
                  className="absolute top-0 flex flex-col items-start"
                  style={{ left: timeToX(t) }}
                >
                  <div className="w-px bg-white/20" style={{ height: t % 5000 === 0 ? 10 : 6, marginTop: "auto" }} />
                  {t % 1000 === 0 && (
                    <span
                      className="absolute bottom-1 left-1 text-[9px] text-white/30 tabular-nums"
                      style={{ fontFamily: "monospace" }}
                    >
                      {formatTimeMMSS(t)}
                    </span>
                  )}
                </div>
              ))}
              {/* Playhead triangle on ruler */}
              <div
                className="absolute top-0 z-40 pointer-events-none"
                style={{ left: timeToX(currentTime), transform: "translateX(-50%)" }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "8px solid #ef4444",
                  }}
                />
              </div>
            </div>

            {/* Flood track */}
            <TrackRow
              height={TRACK_HEIGHT}
              color="rgba(234,179,8,0.08)"
              onClick={handleTrackClick}
            >
              {localDirections.map((cue) => (
                <CueBlock
                  key={cue.startTime}
                  cue={cue}
                  type="flood"
                  timeToX={timeToX}
                  trackHeight={TRACK_HEIGHT}
                  isSelected={selectedTimestamp === cue.startTime}
                  onMouseDownMove={(e) => startDrag(e, cue, "move")}
                  onMouseDownLeft={(e) => startDrag(e, cue, "resize-left")}
                  onMouseDownRight={(e) => startDrag(e, cue, "resize-right")}
                  onDelete={() => onDeleteCue(cue.startTime)}
                  onDuplicate={() => onDuplicateCue(cue)}
                />
              ))}
            </TrackRow>

            {/* Overhead track */}
            <TrackRow
              height={TRACK_HEIGHT}
              color="rgba(96,165,250,0.06)"
              onClick={handleTrackClick}
            >
              {localDirections.map((cue) => (
                <CueBlock
                  key={cue.startTime}
                  cue={cue}
                  type="overhead"
                  timeToX={timeToX}
                  trackHeight={TRACK_HEIGHT}
                  isSelected={selectedTimestamp === cue.startTime}
                  onMouseDownMove={(e) => startDrag(e, cue, "move")}
                  onMouseDownLeft={(e) => startDrag(e, cue, "resize-left")}
                  onMouseDownRight={(e) => startDrag(e, cue, "resize-right")}
                  onDelete={() => onDeleteCue(cue.startTime)}
                  onDuplicate={() => onDuplicateCue(cue)}
                />
              ))}
            </TrackRow>

            {/* Playhead line */}
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none"
              style={{ left: timeToX(currentTime), width: 1, background: "#ef4444", boxShadow: "0 0 6px #ef4444aa" }}
            />

          </div>
        </div>
      </div>

      {/* ── CUE INSPECTOR ─────────────────────────────────────────────────── */}
      {selectedCue && (
        <div
          style={{ background: "#111114", borderTop: "1px solid rgba(255,255,255,0.08)" }}
          className="flex-shrink-0"
        >
          {/* Header row */}
          <div
            className="flex items-center gap-3 px-4 py-2 cursor-pointer"
            onClick={() => setPanelOpen((p) => !p)}
          >
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Cue Inspector</span>
            <span className="text-[10px] text-white/25 font-mono">
              {formatTimeMMSS(selectedCue.startTime)} → {formatTimeMMSS(selectedCue.endTime)}
            </span>
            <div className="flex-1" />
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicateCue(selectedCue) }}
              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteCue(selectedCue.startTime) }}
              className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            {panelOpen ? <ChevronDown className="w-3.5 h-3.5 text-white/30" /> : <ChevronUp className="w-3.5 h-3.5 text-white/30" />}
          </div>

          {panelOpen && (
            <div className="grid grid-cols-2 gap-4 px-4 pb-4">
              {/* Flood panel */}
              <InspectorPanel
                label="Floodlight"
                accent="#eab308"
                showColor
                colorValue={selectedCue.floodlight.color}
                onColorChange={(c) => onUpdateCue({ ...selectedCue, floodlight: { ...selectedCue.floodlight, color: c } })}
                percent={selectedCue.floodlight.percent}
                onPercentChange={(v) => onUpdateCue({ ...selectedCue, floodlight: { ...selectedCue.floodlight, percent: v } })}
                notes={selectedCue.floodlight.notes ?? ""}
                onNotesChange={(n) => onUpdateCue({ ...selectedCue, floodlight: { ...selectedCue.floodlight, notes: n } })}
              />
              {/* Overhead panel */}
              <InspectorPanel
                label="Overhead"
                accent="#60a5fa"
                percent={selectedCue.overhead.percent}
                onPercentChange={(v) => onUpdateCue({ ...selectedCue, overhead: { ...selectedCue.overhead, percent: v } })}
                notes={selectedCue.overhead.notes ?? ""}
                onNotesChange={(n) => onUpdateCue({ ...selectedCue, overhead: { ...selectedCue.overhead, notes: n } })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TrackRow({
  height,
  color,
  children,
  onClick,
}: {
  height: number
  color: string
  children: React.ReactNode
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}) {
  return (
    <div
      className="relative"
      style={{
        height,
        background: color,
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        cursor: "crosshair",
      }}
      onClick={onClick}
    >
      {/* Grid lines */}
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
  onDelete,
  onDuplicate,
}: {
  cue: Direction
  type: "flood" | "overhead"
  timeToX: (ms: number) => number
  trackHeight: number
  isSelected: boolean
  onMouseDownMove: (e: React.MouseEvent) => void
  onMouseDownLeft: (e: React.MouseEvent) => void
  onMouseDownRight: (e: React.MouseEvent) => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const left = timeToX(cue.startTime)
  const width = Math.max(12, timeToX(cue.endTime) - timeToX(cue.startTime))
  const isFlood = type === "flood"

  const baseColor = isFlood ? cue.floodlight.color : "#7aa2f7"
  const pct = isFlood ? cue.floodlight.percent : cue.overhead.percent
  const textDark = getLuminance(baseColor) > 150

  const alpha = Math.round(Math.max(40, pct) / 100 * 255).toString(16).padStart(2, "0")
  const bgColor = `${baseColor}${alpha}`
  const borderColor = isSelected ? baseColor : `${baseColor}88`

  return (
    <div
      className="absolute top-1 rounded-sm group"
      style={{
        left,
        width,
        height: trackHeight - 8,
        background: isSelected
          ? `linear-gradient(135deg, ${baseColor}cc, ${baseColor}88)`
          : `${baseColor}55`,
        border: `1px solid ${borderColor}`,
        boxShadow: isSelected ? `0 0 12px ${baseColor}55, inset 0 0 8px ${baseColor}22` : "none",
        cursor: "grab",
        overflow: "hidden",
        zIndex: isSelected ? 10 : 5,
        transition: "box-shadow 0.1s",
      }}
      onMouseDown={onMouseDownMove}
    >
      {/* Left resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 hover:bg-white/20 transition-colors"
        style={{ width: HANDLE_WIDTH, cursor: "ew-resize" }}
        onMouseDown={(e) => { e.stopPropagation(); onMouseDownLeft(e) }}
      >
        <div className="absolute top-1/2 left-1 -translate-y-1/2 w-0.5 h-4 rounded-full bg-white/30" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center px-3 pointer-events-none">
        {width > 40 && (
          <span
            className="text-[9px] font-bold uppercase tracking-widest truncate"
            style={{ color: isSelected ? (textDark ? "#000" : "#fff") : "rgba(255,255,255,0.7)" }}
          >
            {pct}%
          </span>
        )}
      </div>

      {/* Right resize handle */}
      <div
        className="absolute right-0 top-0 bottom-0 hover:bg-white/20 transition-colors"
        style={{ width: HANDLE_WIDTH, cursor: "ew-resize" }}
        onMouseDown={(e) => { e.stopPropagation(); onMouseDownRight(e) }}
      >
        <div className="absolute top-1/2 right-1 -translate-y-1/2 w-0.5 h-4 rounded-full bg-white/30" />
      </div>
    </div>
  )
}

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[9px] text-white/30 uppercase tracking-widest">{label}</span>
      <div className="flex items-end gap-2">
        <div className="flex items-end gap-0.5" style={{ height: 28 }}>
          {[...Array(10)].map((_, i) => {
            const threshold = (i + 1) * 10
            const active = value >= threshold
            return (
              <div
                key={i}
                className="w-1.5 rounded-sm transition-all duration-100"
                style={{
                  height: 6 + i * 2,
                  background: active ? color : "rgba(255,255,255,0.08)",
                  boxShadow: active ? `0 0 4px ${color}88` : "none",
                }}
              />
            )
          })}
        </div>
        <span className="text-sm font-bold text-white/80 tabular-nums" style={{ fontFamily: "monospace" }}>
          {value}
          <span className="text-[10px] text-white/30">%</span>
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
  onColorChange?: (c: string) => void
  percent: number
  onPercentChange: (v: number) => void
  notes: string
  onNotesChange: (n: string) => void
}) {
  return (
    <div className="rounded-lg p-3 space-y-3" style={{ background: "#0d0d0f", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
        <span className="text-[10px] uppercase tracking-widest" style={{ color: accent }}>
          {label}
        </span>
      </div>

      {showColor && colorValue && onColorChange && (
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-white/30 w-10 flex-shrink-0">Color</label>
          <input
            type="color"
            value={colorValue}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-8 h-6 rounded cursor-pointer border-0 bg-transparent"
          />
          <code className="text-[10px] text-white/40 font-mono">{colorValue}</code>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="text-[10px] text-white/30 w-10 flex-shrink-0">Level</label>
        <input
          type="range"
          min="0"
          max="100"
          value={percent}
          onChange={(e) => onPercentChange(Number(e.target.value))}
          className="flex-1 h-1 appearance-none rounded-full cursor-pointer"
          style={{ accentColor: accent }}
        />
        <span className="text-[11px] font-bold w-8 text-right tabular-nums" style={{ color: accent, fontFamily: "monospace" }}>
          {percent}%
        </span>
      </div>

      <div>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Notes…"
          rows={1}
          className="w-full text-[11px] bg-transparent text-white/50 placeholder-white/15 border-b border-white/10 focus:border-white/25 focus:outline-none resize-none pb-1"
          style={{ fontFamily: "inherit" }}
        />
      </div>
    </div>
  )
}