"use client"

import { Direction, Floodlight, Overhead } from "@/lib/types"
import { Trash2, Copy, Zap, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"
import { formatTimeMMSS } from "@/lib/time-utils"

interface CueEditorProps {
  cue: Direction | null
  onUpdate: (cue: Direction) => void
  onDelete: (startTime: number) => void
  onDuplicate: (cue: Direction) => void
  disabled?: boolean
}

export function CueEditor({ cue, onUpdate, onDelete, onDuplicate, disabled = false }: CueEditorProps) {
  if (!cue) {
    return (
      <div className="p-8 bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur text-center h-full flex flex-col items-center justify-center">
        <Sun className="w-12 h-12 text-slate-600 mb-4" />
        <p className="text-slate-400">Click on a lighting cue in the timeline</p>
        <p className="text-sm text-slate-500 mt-2">Select it to edit colors, intensity, and notes</p>
      </div>
    )
  }

  const formatTime = (ms: number): string => {
    return formatTimeMMSS(ms)
  }

  const handleFloodlightChange = (field: string, value: string | number) => {
    const updatedCue: Direction = {
      ...cue,
      floodlight: {
        ...cue.floodlight,
        [field]: value,
      },
    }
    onUpdate(updatedCue)
  }

  const handleOverheadChange = (field: string, value: string | number) => {
    const updatedCue: Direction = {
      ...cue,
      overhead: {
        ...cue.overhead,
        [field]: value,
      },
    }
    onUpdate(updatedCue)
  }

  return (
    <div className="space-y-6 p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur">
      {/* Header */}
      <div className="pb-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-black text-white">Lighting Cue</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => onDuplicate(cue)}
              disabled={disabled}
              variant="outline"
              size="sm"
              className="text-slate-400 border-slate-600/50 hover:text-white hover:border-slate-500"
              title="Duplicate this cue 1 second later"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onDelete(cue.startTime)}
              disabled={disabled}
              variant="outline"
              size="sm"
              className="text-red-400 border-red-500/30 hover:text-red-300 hover:border-red-400 hover:bg-red-500/10"
              title="Delete this cue"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-slate-300 bg-slate-900/50 px-3 py-2 rounded border border-slate-700/50 inline-block">
          <span className="text-slate-400">Duration:</span> <span className="font-mono font-semibold text-blue-300">{formatTime(cue.startTime)} → {formatTime(cue.endTime)}</span>
        </div>
      </div>

      {/* Floodlight Settings */}
      <div className="space-y-4 p-4 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Floodlight</h3>
        </div>

        {/* Color Picker */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">Color</label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={cue.floodlight.color || "#ffffff"}
              onChange={(e) => handleFloodlightChange("color", e.target.value)}
              disabled={disabled}
              className="w-16 h-12 cursor-pointer rounded border-2 border-slate-600/50 hover:border-yellow-400/50 transition-colors"
            />
            <code className="text-xs font-mono bg-slate-900/50 px-3 py-2 rounded flex-1 border border-slate-700/50 text-slate-200">
              {cue.floodlight.color}
            </code>
          </div>
        </div>

        {/* Intensity Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">Intensity</label>
            <div className="text-sm font-black text-yellow-300 bg-slate-900/70 px-3 py-1 rounded border border-slate-700/50">
              {cue.floodlight.percent}%
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={cue.floodlight.percent}
            onChange={(e) => handleFloodlightChange("percent", Number(e.target.value))}
            disabled={disabled}
            className="w-full h-2 cursor-pointer rounded-lg appearance-none bg-gradient-to-r from-slate-900 to-slate-800 accent-yellow-400 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-400 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-yellow-400/50"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">Notes</label>
          <textarea
            value={cue.floodlight.notes || ""}
            onChange={(e) => handleFloodlightChange("notes", e.target.value)}
            disabled={disabled}
            placeholder="e.g., Turn on, change to red, strobe"
            rows={2}
            className="w-full px-3 py-2 border border-slate-600/50 rounded-lg bg-slate-900/50 text-slate-100 placeholder-slate-600 disabled:opacity-50 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 transition-colors resize-none"
          />
        </div>
      </div>

        {/* Overhead Settings */}
        <div className="space-y-4 p-4 bg-gradient-to-br from-slate-600/5 to-slate-400/5 border border-slate-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-slate-400 rounded-full shadow-lg shadow-slate-400/50"></div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Overhead</h3>
          </div>

          {/* Intensity Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">Intensity</label>
              <div className="text-sm font-black text-slate-300 bg-slate-900/70 px-3 py-1 rounded border border-slate-700/50">
                {cue.overhead.percent}%
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={cue.overhead.percent}
              onChange={(e) => handleOverheadChange("percent", Number(e.target.value))}
              disabled={disabled}
              className="w-full h-2 cursor-pointer rounded-lg appearance-none bg-gradient-to-r from-slate-900 to-slate-800 accent-slate-400 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-400 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-slate-400/50"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">Notes</label>
            <textarea
              value={cue.overhead.notes || ""}
              onChange={(e) => handleOverheadChange("notes", e.target.value)}
              disabled={disabled}
              placeholder="e.g., Dim down, raise to full, pulse to beat"
              rows={2}
              className="w-full px-3 py-2 border border-slate-600/50 rounded-lg bg-slate-900/50 text-slate-100 placeholder-slate-600 disabled:opacity-50 focus:outline-none focus:border-slate-400/50 focus:ring-1 focus:ring-slate-400/20 transition-colors resize-none"
            />
          </div>
        </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="text-xs text-slate-500 px-3 py-2 bg-slate-900/30 rounded border border-slate-700/30">
        <span>💡 Tip: Click other cues in the timeline to switch between them. Use Duplicate to create similar cues quickly.</span>
      </div>
    </div>
  )
}
