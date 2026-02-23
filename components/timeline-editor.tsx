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
