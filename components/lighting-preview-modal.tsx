"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play, X } from "lucide-react"
import { Button } from "./ui/button"
import type { AudioGroup } from "@/lib/types"
import { formatTimeMMSS } from "@/lib/time-utils"

interface LightingPreviewModalProps {
  group: AudioGroup
  onClose: () => void
  onConfirm: () => void
}

export function LightingPreviewModal({ group, onClose, onConfirm }: LightingPreviewModalProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime * 1000)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  const currentDirection = group.directions
    .filter((direction) => direction.startTime <= currentTime)
    .sort((a, b) => b.startTime - a.startTime)[0] || null

  const nextDirection = group.directions.find((direction) => direction.startTime > currentTime) || null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/55 p-4 backdrop-blur-sm">
      <div className="soft-card-strong flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-200/80 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Preview</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">Lighting cue check</h2>
          </div>
          <button onClick={onClose} className="rounded-full border border-stone-200 bg-white/80 p-2 text-stone-600 transition hover:bg-white hover:text-stone-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <audio ref={audioRef} src={group.audioUrl} crossOrigin="anonymous" />

          <div className="muted-card p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-lg font-semibold text-stone-900">{group.name}</p>
                <p className="mt-1 text-sm text-stone-600">
                  {formatTimeMMSS(currentTime)} / {formatTimeMMSS(group.duration)}
                </p>
              </div>

              <Button type="button" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? "Pause preview" : "Play preview"}
              </Button>
            </div>

            <input
              type="range"
              min="0"
              max={group.duration}
              value={currentTime}
              onChange={(event) => {
                const time = Number(event.target.value)
                setCurrentTime(time)
                if (audioRef.current) {
                  audioRef.current.currentTime = time / 1000
                }
              }}
              className="mt-5 w-full accent-[var(--primary)]"
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="soft-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Current cue</p>
              {currentDirection ? (
                <div className="mt-4 space-y-4 text-sm text-stone-600">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Starts at</p>
                    <p className="mt-1 text-lg font-semibold text-stone-900">{formatTimeMMSS(currentDirection.startTime)}</p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white/80 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full border border-stone-200" style={{ backgroundColor: currentDirection.floodlight.color }} />
                      <div>
                        <p className="font-semibold text-stone-900">Floodlight {currentDirection.floodlight.percent}%</p>
                        {currentDirection.floodlight.notes && <p className="text-sm text-stone-500">{currentDirection.floodlight.notes}</p>}
                      </div>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-stone-100">
                      <div className="h-full rounded-full" style={{ width: `${currentDirection.floodlight.percent}%`, backgroundColor: currentDirection.floodlight.color }} />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white/80 p-4">
                    <p className="font-semibold text-stone-900">Overhead {currentDirection.overhead.percent}%</p>
                    {currentDirection.overhead.notes && <p className="mt-1 text-sm text-stone-500">{currentDirection.overhead.notes}</p>}
                    <div className="mt-3 h-2 rounded-full bg-stone-100">
                      <div className="h-full rounded-full bg-sky-500" style={{ width: `${currentDirection.overhead.percent}%` }} />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-stone-500">No cue is active at the current playhead position.</p>
              )}
            </div>

            <div className="soft-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Next cue</p>
              {nextDirection ? (
                <div className="mt-4 space-y-4 text-sm text-stone-600">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Starts at</p>
                    <p className="mt-1 text-lg font-semibold text-stone-900">{formatTimeMMSS(nextDirection.startTime)}</p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white/80 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full border border-stone-200" style={{ backgroundColor: nextDirection.floodlight.color }} />
                      <div>
                        <p className="font-semibold text-stone-900">Floodlight {nextDirection.floodlight.percent}%</p>
                        {nextDirection.floodlight.notes && <p className="text-sm text-stone-500">{nextDirection.floodlight.notes}</p>}
                      </div>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-stone-100">
                      <div className="h-full rounded-full" style={{ width: `${nextDirection.floodlight.percent}%`, backgroundColor: nextDirection.floodlight.color }} />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white/80 p-4">
                    <p className="font-semibold text-stone-900">Overhead {nextDirection.overhead.percent}%</p>
                    {nextDirection.overhead.notes && <p className="mt-1 text-sm text-stone-500">{nextDirection.overhead.notes}</p>}
                    <div className="mt-3 h-2 rounded-full bg-stone-100">
                      <div className="h-full rounded-full bg-sky-500" style={{ width: `${nextDirection.overhead.percent}%` }} />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-stone-500">There are no more cues after this point.</p>
              )}
            </div>
          </div>

          <div className="soft-card mt-6 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              All cues ({group.directions.length})
            </p>
            <div className="mt-4 grid gap-2">
              {group.directions.map((cue, index) => (
                <div
                  key={index}
                  className={`flex flex-wrap items-center gap-4 rounded-2xl border px-4 py-3 text-sm ${
                    cue.startTime <= currentTime ? "border-amber-200 bg-amber-50/80" : "border-stone-200 bg-white/75"
                  }`}
                >
                  <span className="min-w-20 font-semibold text-stone-900">{formatTimeMMSS(cue.startTime)}</span>
                  <span className="flex items-center gap-2 text-stone-600">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cue.floodlight.color }} />
                    Flood {cue.floodlight.percent}%
                  </span>
                  <span className="text-stone-600">Overhead {cue.overhead.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-stone-200/80 px-6 py-5 sm:flex-row">
          <Button type="button" variant="outline" onClick={onClose} className="sm:flex-1">
            Go back to editing
          </Button>
          <Button type="button" onClick={onConfirm} className="sm:flex-1">
            Confirm and save
          </Button>
        </div>
      </div>
    </div>
  )
}
