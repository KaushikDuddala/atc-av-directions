"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Play, Pause, Plus, Trash2, Copy, ZoomIn, ZoomOut, ChevronDown, ChevronUp, Sun, Zap } from "lucide-react"
import type { Direction } from "@/lib/types"
import { formatTimeMMSS } from "@/lib/time-utils"

interface TimelineEditorProps {
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

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

type DragState = 
  | { type: "none" }
  | { type: "move"; index: number; lastX: number; startStart: number; startEnd: number }
  | { type: "resize-left"; index: number; lastX: number; originalStart: number }
  | { type: "resize-right"; index: number; lastX: number; originalEnd: number }
  | { type: "playhead" }

export function TimelineEditor({
  duration,
  directions,
  onDirectionsChange,
  currentTime,
  onSeek,
  isPlaying,
  onPlayPause,
  selectedTimestamp,
  onSelectCue,
}: TimelineEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineScrollRef = useRef<HTMLDivElement>(null)

  const [zoom, setZoom] = useState(1)
  const [drag, setDrag] = useState<DragState>({ type: "none" })
  const [panelOpen, setPanelOpen] = useState(true)

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

  const selectedCue = useMemo(() => directions.find((c) => c.startTime === selectedTimestamp), [directions, selectedTimestamp])

  const currentCue = useMemo(() => {
    const sorted = [...directions].sort((a, b) => (b.startTime ?? 0) - (a.startTime ?? 0))
    return sorted.find((c) => (c.startTime ?? 0) <= currentTime) || null
  }, [directions, currentTime])

  const rulerMarkers = useMemo(() => {
    const pxPerSec = zoom * 1000
    const intervals = [0.25, 0.5, 1, 2, 5, 10, 15, 30, 60]
    const interval = (intervals.find((v) => v * pxPerSec >= 60) || 60) * 1000
    const marks: number[] = []
    for (let t = 0; t <= duration; t += interval) marks.push(t)
    return marks
  }, [duration, zoom])

  const handleMouseMove = (e: MouseEvent) => {
    if (drag.type === "none" || !timelineScrollRef.current) return
    const rect = timelineScrollRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left + timelineScrollRef.current.scrollLeft

    if (drag.type === "playhead") {
      onSeek(clamp(xToTime(x), 0, duration))
      return
    }

    const deltaX = x - drag.lastX
    const deltaMs = xToTime(deltaX)
    const cue = directions[drag.index]
    if (!cue || cue.startTime === undefined || cue.endTime === undefined) return

    let updated = [...directions]

    if (drag.type === "move") {
      const newStart = drag.startStart + deltaMs
      const newEnd = drag.startEnd + deltaMs
      const sorted = [...directions].sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0))
      const idx = sorted.findIndex((c) => c === cue)
      const prevEnd = idx > 0 ? (sorted[idx - 1].endTime ?? 0) : 0
      const nextStart = idx < sorted.length - 1 ? (sorted[idx + 1].startTime ?? duration) : duration
      const minS = prevEnd
      const maxS = nextStart - (cue.endTime - cue.startTime)
      const clampedS = clamp(newStart, minS, maxS)
      const clampedE = clampedS + (cue.endTime - cue.startTime)
      updated = directions.map((c) => c === cue ? { ...c, startTime: clampedS, endTime: clampedE } : c)
    } else if (drag.type === "resize-left") {
      const newStart = drag.originalStart + deltaMs
      const minStart = Math.max(0, (directions.filter((c) => (c.endTime ?? 0) <= cue.startTime).sort((a, b) => (b.endTime ?? 0) - (a.endTime ?? 0))[0]?.endTime) || 0)
      const clampedStart = clamp(newStart, minStart, cue.endTime - MIN_CUE_DURATION)
      updated = directions.map((c) => c === cue ? { ...c, startTime: clampedStart } : c)
    } else if (drag.type === "resize-right") {
      const newEnd = drag.originalEnd + deltaMs
      const maxEnd = (directions.filter((c) => (c.startTime ?? 0) >= cue.endTime).sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0))[0]?.startTime) || duration
      const clampedEnd = clamp(newEnd, cue.startTime + MIN_CUE_DURATION, maxEnd)
      updated = directions.map((c) => c === cue ? { ...c, endTime: clampedEnd } : c)
    }

    onDirectionsChange(updated.sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0)))
  }

  const handleMouseUp = () => {
    setDrag({ type: "none" })
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove as any)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove as any)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [drag, directions])

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

  const handleRulerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setDrag({ type: "playhead" })
  }

  const handleTrackClick = (e: React.MouseEvent) => {
    if (drag.type !== "none" || !timelineScrollRef.current) return
    const rect = timelineScrollRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left + timelineScrollRef.current.scrollLeft
    const timestamp = clamp(xToTime(x), 0, duration)

    if (directions.some((c) => timestamp >= (c.startTime ?? 0) && timestamp < (c.endTime ?? 0))) return

    const newCue: Direction = {
      startTime: timestamp,
      endTime: Math.min(timestamp + DEFAULT_CUE_DURATION, duration),
      floodlight: { percent: 50, color: "#ffaa00", notes: "" },
      overhead: { percent: 50, notes: "" },
    }

    onDirectionsChange([...directions, newCue].sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0)))
    onSelectCue(newCue.startTime)
  }

  const handleCueMouseDown = (e: React.MouseEvent, index: number, mode: "move" | "resize-left" | "resize-right") => {
    e.preventDefault()
    e.stopPropagation()
    const cue = directions[index]
    if (!cue || cue.startTime === undefined) return
    onSelectCue(cue.startTime)
    if (!timelineScrollRef.current) return
    const rect = timelineScrollRef.current.getBoundingClientRect()
    const lastX = e.clientX - rect.left + timelineScrollRef.current.scrollLeft

    if (mode === "move") {
      setDrag({ type: "move", index, lastX, startStart: cue.startTime, startEnd: cue.endTime ?? 0 })
    } else if (mode === "resize-left") {
      setDrag({ type: "resize-left", index, lastX, originalStart: cue.startTime })
    } else if (mode === "resize-right") {
      setDrag({ type: "resize-right", index, lastX, originalEnd: cue.endTime ?? 0 })
    }
  }

  const handleDuplicateCue = (index: number) => {
    const cue = directions[index]
    if (!cue || cue.startTime === undefined || cue.endTime === undefined) return
    const newCue: Direction = { ...cue, startTime: cue.endTime, endTime: Math.min(cue.endTime + (cue.endTime - cue.startTime), duration) }
    onDirectionsChange([...directions, newCue].sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0)))
    onSelectCue(newCue.startTime)
  }

  const handleDeleteCue = (index: number) => {
    const cue = directions[index]
    if (!cue) return
    onDirectionsChange(directions.filter((c) => c !== cue))
    onSelectCue(undefined)
  }

  const handleUpdateCue = (updater: (cue: Direction) => Direction) => {
    if (!selectedCue) return
    const updated = directions.map((c) => (c === selectedCue ? updater(c) : c))
    onDirectionsChange(updated)
  }

  const floodlightBeams = currentCue && currentCue.floodlight ? [ `radial-gradient(circle at 0% 0%, ${currentCue.floodlight.color}${Math.round(((currentCue.floodlight.percent ?? 0) / 100) * 180).toString(16).padStart(2, "0")} 0%, transparent 36%)`, `radial-gradient(circle at 100% 0%, ${currentCue.floodlight.color}${Math.round(((currentCue.floodlight.percent ?? 0) / 100) * 180).toString(16).padStart(2, "0")} 0%, transparent 36%)`, `radial-gradient(circle at 0% 100%, ${currentCue.floodlight.color}${Math.round(((currentCue.floodlight.percent ?? 0) / 100) * 180).toString(16).padStart(2, "0")} 0%, transparent 36%)`, `radial-gradient(circle at 100% 100%, ${currentCue.floodlight.color}${Math.round(((currentCue.floodlight.percent ?? 0) / 100) * 180).toString(16).padStart(2, "0")} 0%, transparent 36%)` ].join(", ") : "none"

  return (
    <div ref={containerRef} className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0f] text-white select-none">
      <div className="relative h-44 flex-shrink-0 overflow-hidden" style={{ background: "#050507", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute inset-0 transition-opacity duration-200" style={{ background: [ `radial-gradient(circle at 0% 0%, rgba(160,180,255,${((currentCue?.overhead?.percent ?? 0) / 100) * 0.28}) 0%, transparent 38%)`, `radial-gradient(circle at 100% 0%, rgba(160,180,255,${((currentCue?.overhead?.percent ?? 0) / 100) * 0.28}) 0%, transparent 38%)`, `radial-gradient(circle at 0% 100%, rgba(160,180,255,${((currentCue?.overhead?.percent ?? 0) / 100) * 0.28}) 0%, transparent 38%)`, `radial-gradient(circle at 100% 100%, rgba(160,180,255,${((currentCue?.overhead?.percent ?? 0) / 100) * 0.28}) 0%, transparent 38%)` ].join(", ") }} />
        {currentCue && <div className="absolute inset-0 transition-all duration-300" style={{ background: floodlightBeams }} />}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)" }} />
        <div className="absolute top-4 left-5 flex gap-4">
          <Meter label="OVERHEAD" value={currentCue?.overhead?.percent ?? 0} color="#8ab4ff" />
          <Meter label="FLOOD" value={currentCue?.floodlight?.percent ?? 0} color={currentCue?.floodlight?.color ?? "#ffaa00"} />
          {currentCue && <div className="flex flex-col gap-1"><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">Color</span><div className="h-8 w-10 rounded-sm border border-white/10" style={{ backgroundColor: currentCue.floodlight?.color }} /></div>}
        </div>
        <div className="absolute bottom-4 right-5 text-right"><div className="text-2xl font-bold leading-none tracking-tight text-white/90">{formatTimeMMSS(currentTime)}</div><div className="mt-0.5 text-xs font-medium text-white/60">/ {formatTimeMMSS(duration)}</div></div>
        {!currentCue && <div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">No cue active</span></div>}
      </div>

      <div className="flex flex-shrink-0 items-center gap-3 px-4 py-2" style={{ background: "#111114", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onPlayPause} className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-all" style={{ background: isPlaying ? "#ef4444" : "#2563eb", color: "#fff" }}>{isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}{isPlaying ? "STOP" : "PLAY"}</button>
        <div className="h-5 w-px bg-white/10" />
        <button onClick={() => { if (!directions.some((c) => currentTime >= (c.startTime ?? 0) && currentTime < (c.endTime ?? 0))) { const nc: Direction = { startTime: currentTime, endTime: Math.min(currentTime + DEFAULT_CUE_DURATION, duration), floodlight: { percent: 50, color: "#ffaa00", notes: "" }, overhead: { percent: 50, notes: "" } }; onDirectionsChange([...directions, nc].sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0))); onSelectCue(nc.startTime); } }} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-white/85 transition-all hover:bg-white/10 hover:text-white"><Plus className="h-3.5 w-3.5" />ADD CUE</button>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.max(0.02, z * 0.75))} className="rounded p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white" title="Zoom out"><ZoomOut className="h-3.5 w-3.5" /></button>
          <div className="w-16 text-center text-xs font-medium tabular-nums text-white/70">{Math.round(zoom * 1000)}px/s</div>
          <button onClick={() => setZoom((z) => Math.min(5, z * 1.33))} className="rounded p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white" title="Zoom in"><ZoomIn className="h-3.5 w-3.5" /></button>
        </div>
        <div className="text-xs font-medium tabular-nums text-white/65">{directions.length} cue{directions.length !== 1 ? "s" : ""}</div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex w-28 flex-shrink-0 flex-col" style={{ background: "#0d0d0f", borderRight: "1px solid rgba(255,255,white,0.06)" }}>
          <div style={{ height: RULER_HEIGHT, borderBottom: "1px solid rgba(255,255,white,0.06)" }} />
          <div className="flex items-center gap-2 px-3" style={{ height: TRACK_HEIGHT, borderBottom: "1px solid rgba(255,255,white,0.06)" }}><Zap className="h-3 w-3 flex-shrink-0 text-yellow-400/70" /><span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/85">Flood</span></div>
          <div className="flex items-center gap-2 px-3" style={{ height: TRACK_HEIGHT }}><Sun className="h-3 w-3 flex-shrink-0 text-blue-300/70" /><span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/85">Over</span></div>
        </div>

        <div ref={timelineScrollRef} className="relative flex-1 overflow-x-auto overflow-y-hidden" style={{ cursor: drag.type === "none" ? "default" : "grabbing" }}>
          <div style={{ width: timelineWidth + 80, position: "relative" }}>
            <div className="sticky top-0 z-30" style={{ height: RULER_HEIGHT, background: "#111114", borderBottom: "1px solid rgba(255,255,white,0.08)" }} onMouseDown={handleRulerMouseDown}>
              {rulerMarkers.map((time) => (
                <div key={time} className="absolute top-0 flex flex-col items-start" style={{ left: timeToX(time) }}>
                  <div className="w-px bg-white/20" style={{ height: time % 5000 === 0 ? 10 : 6, marginTop: "auto" }} />
                  {time % 1000 === 0 && <span className="absolute top-2 left-1 text-[11px] font-medium tabular-nums text-white/70">{formatTimeMMSS(time)}</span>}
                </div>
              ))}
              <div className="pointer-events-none absolute top-0 z-40" style={{ left: timeToX(currentTime), transform: "translateX(-50%)" }}><div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "8px solid #ef4444" }} /></div>
            </div>

            <TrackRow height={TRACK_HEIGHT} color="rgba(234,179,8,0.08)" onClick={handleTrackClick}>
              {directions.map((cue, index) => (
                <CueBlock key={`${cue.startTime}-${cue.endTime}-flood`} cue={cue} type="flood" timeToX={timeToX} trackHeight={TRACK_HEIGHT} isSelected={selectedCue === cue} onMouseDownMove={(e) => handleCueMouseDown(e, index, "move")} onMouseDownLeft={(e) => handleCueMouseDown(e, index, "resize-left")} onMouseDownRight={(e) => handleCueMouseDown(e, index, "resize-right")} />
              ))}
            </TrackRow>

            <TrackRow height={TRACK_HEIGHT} color="rgba(96,165,250,0.06)" onClick={handleTrackClick}>
              {directions.map((cue, index) => (
                <CueBlock key={`${cue.startTime}-${cue.endTime}-overhead`} cue={cue} type="overhead" timeToX={timeToX} trackHeight={TRACK_HEIGHT} isSelected={selectedCue === cue} onMouseDownMove={(e) => handleCueMouseDown(e, index, "move")} onMouseDownLeft={(e) => handleCueMouseDown(e, index, "resize-left")} onMouseDownRight={(e) => handleCueMouseDown(e, index, "resize-right")} />
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
            <span className="text-xs font-medium tabular-nums text-white/65">{formatTimeMMSS(selectedCue.startTime ?? 0)} → {formatTimeMMSS(selectedCue.endTime ?? 0)}</span>
            <div className="flex-1" />
            <button onClick={(e) => { e.stopPropagation(); const idx = directions.indexOf(selectedCue); if (idx !== -1) handleDuplicateCue(idx); }} className="rounded p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"><Copy className="h-3.5 w-3.5" /></button>
            <button onClick={(e) => { e.stopPropagation(); const idx = directions.indexOf(selectedCue); if (idx !== -1) handleDeleteCue(idx); }} className="rounded p-1 text-white/40 transition-colors hover:bg-red-500/20 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
            {panelOpen ? <ChevronDown className="h-3.5 w-3.5 text-white/70" /> : <ChevronUp className="h-3.5 w-3.5 text-white/70" />}
          </div>

          {panelOpen && (
            <div className="grid grid-cols-2 gap-4 px-4 pb-4">
              <InspectorPanel label="Floodlight" accent="#eab308" showColor colorValue={selectedCue.floodlight?.color} onColorChange={(color) => handleUpdateCue((c) => ({ ...c, floodlight: { ...c.floodlight, color } }))} percent={selectedCue.floodlight?.percent ?? 0} onPercentChange={(percent) => handleUpdateCue((c) => ({ ...c, floodlight: { ...c.floodlight, percent } }))} notes={selectedCue.floodlight?.notes ?? ""} onNotesChange={(notes) => handleUpdateCue((c) => ({ ...c, floodlight: { ...c.floodlight, notes } }))} />
              <InspectorPanel label="Overhead" accent="#60a5fa" percent={selectedCue.overhead?.percent ?? 0} onPercentChange={(percent) => handleUpdateCue((c) => ({ ...c, overhead: { ...c.overhead, percent } }))} notes={selectedCue.overhead?.notes ?? ""} onNotesChange={(notes) => handleUpdateCue((c) => ({ ...c, overhead: { ...c.overhead, notes } }))} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TrackRow({ height, color, children, onClick }: { height: number; color: string; children: React.ReactNode; onClick: (event: React.MouseEvent<HTMLDivElement>) => void }) {
  return <div className="relative" style={{ height, background: color, borderBottom: "1px solid rgba(255,255,white,0.04)", cursor: "crosshair" }} onClick={onClick}>{children}</div>
}

function CueBlock({ cue, type, timeToX, trackHeight, isSelected, onMouseDownMove, onMouseDownLeft, onMouseDownRight }: { cue: Direction; type: "flood" | "overhead"; timeToX: (ms: number) => number; trackHeight: number; isSelected: boolean; onMouseDownMove: (event: React.MouseEvent) => void; onMouseDownLeft: (event: React.MouseEvent) => void; onMouseDownRight: (event: React.MouseEvent) => void }) {
  const left = timeToX(cue.startTime ?? 0)
  const width = Math.max(12, timeToX((cue.endTime ?? 0)) - timeToX((cue.startTime ?? 0)))
  const isFlood = type === "flood"
  const baseColor = isFlood ? (cue.floodlight?.color ?? "#ffaa00") : "#7aa2f7"
  const percent = isFlood ? (cue.floodlight?.percent ?? 0) : (cue.overhead?.percent ?? 0)
  const getLuminance = (hex: string) => { const r = parseInt(hex.slice(1, 3), 16); const g = parseInt(hex.slice(3, 5), 16); const b = parseInt(hex.slice(5, 7), 16); return 0.299 * r + 0.587 * g + 0.114 * b }
  const textDark = getLuminance(baseColor) > 150
  return (
    <div className="group absolute top-1 rounded-sm" style={{ left, width, height: trackHeight - 8, background: isSelected ? `linear-gradient(135deg, ${baseColor}cc, ${baseColor}88)` : `${baseColor}55`, border: `1px solid ${isSelected ? baseColor : `${baseColor}88`}`, boxShadow: isSelected ? `0 0 12px ${baseColor}55, inset 0 0 8px ${baseColor}22` : "none", cursor: "grab", overflow: "hidden", zIndex: isSelected ? 10 : 5, transition: "box-shadow 0.1s" }} onMouseDown={onMouseDownMove}>
      <div className="absolute left-0 top-0 bottom-0 transition-colors hover:bg-white/20" style={{ width: 8, cursor: "ew-resize" }} onMouseDown={onMouseDownLeft}><div className="absolute left-1 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-white/80" /></div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-3">{width > 40 && <span className="truncate text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: isSelected ? (textDark ? "#000" : "#fff") : "rgba(255,255,white,0.92)" }}>{percent}%</span>}</div>
      <div className="absolute right-0 top-0 bottom-0 transition-colors hover:bg-white/20" style={{ width: 8, cursor: "ew-resize" }} onMouseDown={onMouseDownRight}><div className="absolute right-1 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-white/80" /></div>
    </div>
  )
}

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">{label}</span>
      <div className="flex items-end gap-2">
        <div className="flex items-end gap-0.5" style={{ height: 28 }}>
          {[...Array(10)].map((_, index) => { const threshold = (index + 1) * 10; const active = value >= threshold; return (<div key={index} className="w-1.5 rounded-sm transition-all duration-100" style={{ height: 6 + index * 2, background: active ? color : "rgba(255,255,white,0.08)", boxShadow: active ? `0 0 4px ${color}88` : "none" }} />) })}
        </div>
        <span className="text-sm font-semibold tabular-nums text-white">{value}<span className="text-[10px] text-white/65">%</span></span>
      </div>
    </div>
  )
}

function InspectorPanel({ label, accent, showColor, colorValue, onColorChange, percent, onPercentChange, notes, onNotesChange }: { label: string; accent: string; showColor?: boolean; colorValue?: string; onColorChange?: (value: string) => void; percent: number; onPercentChange: (value: number) => void; notes: string; onNotesChange: (value: string) => void }) {
  return (
    <div style={{ background: "#0a0a0c", border: "1px solid #1e1e2a", borderRadius: 6, padding: "9px 11px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: accent, marginBottom: 9 }}>{label}</div>
      {showColor && colorValue && onColorChange && <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}><span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,white,0.75)", width: 38 }}>COLOR</span><input type="color" value={colorValue} onChange={(event) => onColorChange(event.target.value)} style={{ width: 28, height: 20, border: "none", borderRadius: 3, cursor: "pointer", background: "transparent" }} /><code style={{ fontSize: 11, color: "rgba(255,255,white,0.82)" }}>{colorValue}</code></div>}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,white,0.75)", width: 38 }}>LEVEL</span><input type="range" min={0} max={100} value={percent} onChange={(event) => onPercentChange(Number(event.target.value))} style={{ flex: 1, accentColor: accent, cursor: "pointer" }} /><span style={{ fontSize: 14, fontWeight: 700, width: 40, textAlign: "right", color: accent }}>{percent}%</span></div>
      <input value={notes} onChange={(event) => onNotesChange(event.target.value)} placeholder={`${label} notes...`} style={{ width: "100%", marginTop: 8, background: "#0a0a0c", border: "1px solid #2a2a3a", borderRadius: 5, color: "rgba(255,255,white,0.95)", fontSize: 13, fontWeight: 500, padding: "7px 10px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
    </div>
  )
}
"use client"

import { Direction } from "@/lib/types"
import { useRef, useState, useEffect, useCallback, useMemo } from "react"
import { formatTimeMMSS } from "@/lib/time-utils"
import { Play, Pause, ZoomIn, ZoomOut } from "lucide-react"

interface TimelineEditorProps {
  duration: number
  directions: Direction[]
  onCueClick: (direction: Direction) => void
  onAddCue: (startTime: number, endTime: number) => void
  onUpdateCue: (direction: Direction) => void
  selectedTimestamp?: number
  currentTime?: number
  onPlayPause?: () => void
  isPlaying?: boolean
}

type DragMode = null | "move" | "resize-start" | "resize-end"

export function TimelineEditor({
  duration,
  directions,
  onCueClick,
  onAddCue,
  onUpdateCue,
  selectedTimestamp,
  currentTime = 0,
  onPlayPause,
  isPlaying = false,
}: TimelineEditorProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragMode, setDragMode] = useState<DragMode>(null)
  const [draggedCueTime, setDraggedCueTime] = useState<number | null>(null)
  const [dragStartTime, setDragStartTime] = useState(0)
  const [dragEndTime, setDragEndTime] = useState(0)

  const pixelsPerMs = useMemo(() => {
    return (zoom * 100) / 1000
  }, [zoom])

  const timelineWidth = useMemo(() => {
    return Math.max(1200, (duration / 1000) * zoom * 100)
  }, [duration, zoom])

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.5, 10))
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.5, 0.5))

  const msToPixels = useCallback((ms: number) => ms * pixelsPerMs, [pixelsPerMs])
  const pixelsToMs = useCallback((px: number) => Math.round(px / pixelsPerMs), [pixelsPerMs])

  // Check for overlaps
  const hasOverlap = useCallback((startTime: number, endTime: number, excludeStartTime?: number) => {
    return directions.some((d) => {
      if (excludeStartTime !== undefined && d.startTime === excludeStartTime) return false
      const dStart = d.startTime
      const dEnd = d.endTime
      return !(endTime <= dStart || startTime >= dEnd)
    })
  }, [directions])

  // Handle timeline click to add cue
  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-cue]")) return
    if (!scrollRef.current) return

    const rect = scrollRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left + scrollRef.current.scrollLeft
    const clickTime = pixelsToMs(x)
    const clampedTime = Math.max(0, Math.min(duration, clickTime))

    const cueDuration = 2000 // 2 second default
    const startTime = clampedTime
    const endTime = Math.min(clampedTime + cueDuration, duration)

    if (!hasOverlap(startTime, endTime)) {
      onAddCue(startTime, endTime)
    }
  }, [duration, pixelsToMs, hasOverlap, onAddCue])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setZoom((z) => Math.max(0.5, Math.min(10, z * delta)))
    } else if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY + e.deltaX
    }
  }, [])

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>, mode: DragMode, cueStartTime: number) => {
    if (!mode) return
    e.preventDefault()
    e.stopPropagation()
    
    const draggedCue = directions.find((d) => d.startTime === cueStartTime)
    if (!draggedCue) return

    setIsDragging(true)
    setDragMode(mode)
    setDragStartX(e.clientX)
    setDraggedCueTime(cueStartTime)
    setDragStartTime(draggedCue.startTime)
    setDragEndTime(draggedCue.endTime)
  }, [directions])

  // Global mouse move listener for dragging
  useEffect(() => {
    if (!isDragging || !dragMode || draggedCueTime === null) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const draggedCue = directions.find((d) => d.startTime === draggedCueTime)
      if (!draggedCue) return

      const dragDelta = e.clientX - dragStartX
      const timeDelta = pixelsToMs(dragDelta)

      if (dragMode === "move") {
        const newStartTime = Math.max(0, dragStartTime + timeDelta)
        const duration_ = dragEndTime - dragStartTime
        const newEndTime = Math.min(duration, newStartTime + duration_)

        if (!hasOverlap(newStartTime, newEndTime, draggedCue.startTime)) {
          onUpdateCue({
            ...draggedCue,
            startTime: newStartTime,
            endTime: newEndTime,
          })
        }
      } else if (dragMode === "resize-start") {
        const newStartTime = Math.max(0, Math.min(dragEndTime - 100, dragStartTime + timeDelta))
        
        if (!hasOverlap(newStartTime, dragEndTime, draggedCue.startTime)) {
          onUpdateCue({
            ...draggedCue,
            startTime: newStartTime,
          })
        }
      } else if (dragMode === "resize-end") {
        const newEndTime = Math.min(duration, Math.max(dragStartTime + 100, dragEndTime + timeDelta))
        
        if (!hasOverlap(dragStartTime, newEndTime, draggedCue.startTime)) {
          onUpdateCue({
            ...draggedCue,
            endTime: newEndTime,
          })
        }
      }
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(false)
      setDragMode(null)
      setDraggedCueTime(null)
    }

    document.addEventListener("mousemove", handleGlobalMouseMove)
    document.addEventListener("mouseup", handleGlobalMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging, dragMode, draggedCueTime, dragStartX, dragStartTime, dragEndTime, directions, pixelsToMs, duration, hasOverlap, onUpdateCue])

  const formatTime = (ms: number): string => formatTimeMMSS(ms)

  const sortedDirections = [...directions].sort((a, b) => a.startTime - b.startTime)

  // Time markers
  const markers = useMemo(() => {
    const m: { time: number; major: boolean }[] = []
    let interval = 10000
    if (zoom > 3) interval = 2000
    else if (zoom > 1.5) interval = 5000
    else if (zoom < 0.7) interval = 30000

    for (let t = 0; t <= duration; t += interval / 2) {
      const isMajor = t % interval === 0
      m.push({ time: t, major: isMajor })
    }
    return m
  }, [duration, zoom])

  const playheadPosition = msToPixels(currentTime)

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-3 bg-slate-800 border-b border-slate-700">
        <button
          onClick={onPlayPause}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? "Pause" : "Play"}
        </button>

        <div className="h-6 w-px bg-slate-600" />

        <div className="text-slate-400 text-sm">
          <span className="text-white font-mono">{formatTime(currentTime)}</span>
          <span className="mx-2">/</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-2 py-1">
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-600" />

        <div className="text-slate-400 text-sm">
          {directions.length} cue{directions.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Timeline Area */}
      <div className="flex overflow-hidden">
        {/* Track Labels */}
        <div className="w-32 bg-slate-800 border-r border-slate-700 flex-shrink-0">
          <div className="h-8 border-b border-slate-700" />
          <div className="h-12 px-3 flex items-center text-xs font-semibold text-slate-400 border-b border-slate-700">
            FLOODLIGHT
          </div>
          <div className="h-12 px-3 flex items-center text-xs font-semibold text-slate-400">
            OVERHEAD
          </div>
        </div>

        {/* Timeline Scroll Area */}
        <div
          ref={scrollRef}
          onClick={handleTimelineClick}
          onWheel={handleWheel}
          className="flex-1 overflow-x-auto overflow-y-hidden select-none relative"
          style={{ cursor: isDragging ? "grabbing" : "crosshair" }}
        >
          <div style={{ width: `${timelineWidth}px`, minWidth: "100%", position: "relative" }}>
            
            {/* Time Ruler with grid lines */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900 border-b border-slate-700">
              {markers.map(({ time, major }) => {
                const pos = msToPixels(time)
                return (
                  <div key={time} className="absolute top-0 bottom-0" style={{ left: `${pos}px` }}>
                    <div
                      className={`w-px h-full ${
                        major ? "bg-slate-500" : "bg-slate-700"
                      }`}
                    />
                    {major && (
                      <span className="absolute text-xs text-slate-400 font-mono ml-1">
                        {formatTime(time)}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Vertical grid lines extending through all tracks */}
            <div
              className="absolute top-8 left-0 right-0 bottom-0 pointer-events-none"
              style={{ width: `${timelineWidth}px` }}
            >
              {markers.map(({ time, major }) => {
                const pos = msToPixels(time)
                return (
                  <div
                    key={`grid-${time}`}
                    className={`absolute top-0 bottom-0 w-px ${
                      major ? "bg-slate-600/30" : "bg-slate-700/20"
                    }`}
                    style={{ left: `${pos}px` }}
                  />
                )
              })}
            </div>

            {/* Floodlight Track */}
            <div className="absolute top-8 left-0 right-0 h-12 border-b border-slate-700/50">
              {sortedDirections.map((dir) => {
                const left = msToPixels(dir.startTime)
                const width = msToPixels(dir.endTime - dir.startTime)
                const isSelected = selectedTimestamp === dir.startTime

                return (
                  <div
                    key={`flood-${dir.startTime}`}
                    data-cue
                    onClick={(e) => {
                      e.stopPropagation()
                      onCueClick(dir)
                    }}
                    className={`absolute top-1 bottom-1 rounded cursor-grab active:cursor-grabbing transition-all flex items-center justify-center text-xs font-bold border-2 overflow-hidden group ${
                      isSelected
                        ? "border-blue-400 z-20 ring-2 ring-blue-400/50"
                        : "border-white/20 hover:border-white/50 hover:z-20"
                    }`}
                    style={{
                      left: `${left}px`,
                      width: `${Math.max(48, width)}px`,
                      backgroundColor: dir.floodlight.color || "#ffffff",
                      opacity: Math.max(0.4, (dir.floodlight.percent || 50) / 100),
                    }}
                    onMouseDown={(e) => {
                      if ((e.target as HTMLElement).closest(".resize-handle")) return
                      handleDragStart(e, "move", dir.startTime)
                    }}
                  >
                    <span className="text-white drop-shadow-lg truncate px-1">
                      {dir.floodlight.percent}%
                    </span>
                    {/* Resize handle - start */}
                    <div
                      className="resize-handle absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-400/50 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleDragStart(e, "resize-start", dir.startTime)}
                    />
                    {/* Resize handle - end */}
                    <div
                      className="resize-handle absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-400/50 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleDragStart(e, "resize-end", dir.startTime)}
                    />
                  </div>
                )
              })}
            </div>

            {/* Overhead Track */}
            <div className="absolute top-20 left-0 right-0 h-12">
              {sortedDirections.map((dir) => {
                const left = msToPixels(dir.startTime)
                const width = msToPixels(dir.endTime - dir.startTime)
                const isSelected = selectedTimestamp === dir.startTime

                return (
                  <div
                    key={`over-${dir.startTime}`}
                    data-cue
                    onClick={(e) => {
                      e.stopPropagation()
                      onCueClick(dir)
                    }}
                    className={`absolute top-1 bottom-1 rounded cursor-grab active:cursor-grabbing transition-all flex items-center justify-center text-xs font-bold border-2 overflow-hidden group ${
                      isSelected
                        ? "border-blue-400 z-20 ring-2 ring-blue-400/50"
                        : "border-white/20 hover:border-white/50 hover:z-20"
                    }`}
                    style={{
                      left: `${left}px`,
                      width: `${Math.max(48, width)}px`,
                      backgroundColor: "#64748b",
                      opacity: Math.max(0.4, (dir.overhead.percent || 50) / 100),
                    }}
                    onMouseDown={(e) => {
                      if ((e.target as HTMLElement).closest(".resize-handle")) return
                      handleDragStart(e, "move", dir.startTime)
                    }}
                  >
                    <span className="text-white drop-shadow-lg truncate px-1">
                      {dir.overhead.percent}%
                    </span>
                    {/* Resize handle - start */}
                    <div
                      className="resize-handle absolute left-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-400/50 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleDragStart(e, "resize-start", dir.startTime)}
                    />
                    {/* Resize handle - end */}
                    <div
                      className="resize-handle absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-400/50 opacity-0 group-hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleDragStart(e, "resize-end", dir.startTime)}
                    />
                  </div>
                )
              })}
            </div>

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 pointer-events-none"
              style={{ left: `${playheadPosition}px` }}
            >
              <div className="absolute -top-0 -left-1.5 w-3 h-3 bg-red-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="p-2 bg-slate-800 border-t border-slate-700 text-xs text-slate-500 flex gap-4">
        <span>Click to add cue</span>
        <span>Drag to move</span>
        <span>Edge handles to resize</span>
        <span>Scroll to pan</span>
        <span>Ctrl+scroll to zoom</span>
      </div>
    </div>
  )
}
