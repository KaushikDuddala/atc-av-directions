"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, X, ChevronLeft, ChevronRight } from "lucide-react"
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
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
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
    .filter(d => d.startTime <= currentTime)
    .sort((a, b) => b.startTime - a.startTime)[0] || null

  const nextDirection = group.directions.find(d => d.startTime > currentTime) || null

  const formatTime = (ms: number) => formatTimeMMSS(ms)

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Preview Lighting Cues</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Audio + Time */}
          <div className="mb-6">
            <audio ref={audioRef} src={group.audioUrl} crossOrigin="anonymous" />
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Play"}
              </button>
              <div className="text-white font-mono">
                {formatTime(currentTime)} / {formatTime(group.duration)}
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={group.duration}
              value={currentTime}
              onChange={(e) => {
                const time = Number(e.target.value)
                setCurrentTime(time)
                if (audioRef.current) {
                  audioRef.current.currentTime = time / 1000
                }
              }}
              className="w-full"
            />
          </div>

          {/* Current & Next Directions */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current */}
            <div className="p-4 rounded-lg border border-slate-700 bg-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">CURRENT</h3>
              {currentDirection ? (
                <div className="space-y-3">
                  <div className="text-xs text-slate-500 font-mono">{formatTime(currentDirection.startTime)}</div>
                  
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Floodlight</p>
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-6 h-6 rounded border border-slate-600"
                        style={{ backgroundColor: currentDirection.floodlight.color }}
                      />
                      <span className="text-lg font-bold text-white">{currentDirection.floodlight.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded">
                      <div 
                        className="h-full rounded"
                        style={{ 
                          width: `${currentDirection.floodlight.percent}%`, 
                          backgroundColor: currentDirection.floodlight.color 
                        }}
                      />
                    </div>
                    {currentDirection.floodlight.notes && (
                      <p className="text-xs text-slate-500 mt-1">{currentDirection.floodlight.notes}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">Overhead</p>
                    <div className="w-full h-2 bg-slate-700 rounded mb-1">
                      <div 
                        className="h-full bg-blue-500 rounded"
                        style={{ width: `${currentDirection.overhead.percent}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-white">{currentDirection.overhead.percent}%</span>
                    {currentDirection.overhead.notes && (
                      <p className="text-xs text-slate-500 mt-1">{currentDirection.overhead.notes}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">--:--</p>
              )}
            </div>

            {/* Next */}
            <div className="p-4 rounded-lg border border-slate-700 bg-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">NEXT</h3>
              {nextDirection ? (
                <div className="space-y-3">
                  <div className="text-xs text-slate-500 font-mono">{formatTime(nextDirection.startTime)}</div>
                  
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Floodlight</p>
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-6 h-6 rounded border border-slate-600"
                        style={{ backgroundColor: nextDirection.floodlight.color }}
                      />
                      <span className="text-lg font-bold text-white">{nextDirection.floodlight.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded">
                      <div 
                        className="h-full rounded"
                        style={{ 
                          width: `${nextDirection.floodlight.percent}%`, 
                          backgroundColor: nextDirection.floodlight.color 
                        }}
                      />
                    </div>
                    {nextDirection.floodlight.notes && (
                      <p className="text-xs text-slate-500 mt-1">{nextDirection.floodlight.notes}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">Overhead</p>
                    <div className="w-full h-2 bg-slate-700 rounded mb-1">
                      <div 
                        className="h-full bg-blue-500 rounded"
                        style={{ width: `${nextDirection.overhead.percent}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-white">{nextDirection.overhead.percent}%</span>
                    {nextDirection.overhead.notes && (
                      <p className="text-xs text-slate-500 mt-1">{nextDirection.overhead.notes}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">End of performance</p>
              )}
            </div>
          </div>

          {/* All Cues Summary */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">ALL CUES ({group.directions.length})</h3>
            <div className="space-y-2 max-h-48 overflow-auto">
              {group.directions.map((cue, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-4 p-2 rounded text-sm ${
                    cue.startTime <= currentTime ? 'bg-blue-900/30' : 'bg-slate-800'
                  }`}
                >
                  <span className="text-slate-400 font-mono w-16">{formatTime(cue.startTime)}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: cue.floodlight.color }}
                    />
                    <span className="text-white">FL: {cue.floodlight.percent}%</span>
                  </div>
                  <span className="text-white">OH: {cue.overhead.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Go Back to Edit
          </Button>
          <Button onClick={onConfirm} className="flex-1 bg-green-600 hover:bg-green-700">
            Confirm & Save
          </Button>
        </div>
      </div>
    </div>
  )
}
