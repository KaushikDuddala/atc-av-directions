"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "./ui/button"
import { Select } from "./ui/select"
import type { AudioGroup, PerformanceType } from "@/lib/types"
import { AudioUpload, type AudioUploadResult } from "./audio-upload"

export interface PerformanceFormData {
  name: string
  leaders: string[]
  members: string[]
  length: string
  notes: string
  performanceType: PerformanceType
  performanceTypeOther?: string
}

interface PerformanceFormProps {
  onSubmit: (data: PerformanceFormData, audioResult?: AudioUploadResult) => void
  disabled?: boolean
}

export function PerformanceForm({ onSubmit, disabled = false }: PerformanceFormProps) {
  const [name, setName] = useState("")
  const [leaders, setLeaders] = useState<string[]>([])
  const [leaderInput, setLeaderInput] = useState("")
  const [members, setMembers] = useState<string[]>([])
  const [memberInput, setMemberInput] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [performanceType, setPerformanceType] = useState<PerformanceType>("music")
  const [performanceTypeOther, setPerformanceTypeOther] = useState("")
  const [audioResult, setAudioResult] = useState<AudioUploadResult | undefined>()

  const addLeader = () => {
    if (leaderInput.trim()) {
      setLeaders([...leaders, leaderInput.trim()])
      setLeaderInput("")
    }
  }

  const removeLeader = (index: number) => {
    setLeaders(leaders.filter((_, i) => i !== index))
  }

  const addMember = () => {
    if (memberInput.trim()) {
      setMembers([...members, memberInput.trim()])
      setMemberInput("")
    }
  }

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert("Please enter a performance name")
      return
    }
    if (audioResult === undefined) {
      alert("Please upload an audio file")
      return
    }

    onSubmit(
      {
        name: name.trim(),
        leaders,
        members,
        length: time,
        notes,
        performanceType,
        performanceTypeOther: performanceType === "other" ? performanceTypeOther : undefined,
      },
      audioResult
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white">Performance Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={disabled}
          placeholder="e.g., Sam & Saha Dance Performance"
          className="w-full px-4 py-2.5 border border-slate-600/50 rounded-lg bg-slate-900/50 text-white placeholder-slate-500 disabled:opacity-50 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white">Audio File *</label>
        <div className="flex items-center justify-between p-4 border border-slate-600/50 rounded-lg bg-slate-900/50">
          <div className="flex-1">
            {audioResult ? (
              <div className="text-sm">
                <span className="font-medium text-white">{audioResult.name}</span>
                <span className="text-slate-400 ml-2">
                  ({(audioResult.duration / 1000).toFixed(1)}s)
                </span>
              </div>
            ) : (
              <span className="text-slate-500">No audio file selected</span>
            )}
          </div>
          <AudioUpload onUpload={setAudioResult} disabled={disabled} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white">Performance Type</label>
        <select
          value={performanceType}
          onChange={(e) => setPerformanceType(e.target.value as PerformanceType)}
          disabled={disabled}
          className="w-full px-4 py-2.5 pr-10 border border-slate-600/50 rounded-lg bg-slate-900/50 text-white disabled:opacity-50 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors appearance-none cursor-pointer"
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%2294a3b8%22 stroke-width=%222%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            backgroundSize: '20px',
            paddingRight: '32px'
          }}
        >
          <option value="dance">Dance</option>
          <option value="music">Music</option>
          <option value="singing">Singing</option>
          <option value="other">Other (Specify)</option>
        </select>
        {performanceType === "other" && (
          <input
            type="text"
            value={performanceTypeOther}
            onChange={(e) => setPerformanceTypeOther(e.target.value)}
            disabled={disabled}
            placeholder="Specify performance type"
            className="w-full px-4 py-2.5 border border-slate-600/50 rounded-lg bg-slate-900/50 text-white placeholder-slate-500 disabled:opacity-50 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors mt-2"
          />
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white">Leaders</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={leaderInput}
            onChange={(e) => setLeaderInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLeader())}
            disabled={disabled}
            placeholder="Enter leader name and press Enter"
            className="flex-1 px-4 py-2.5 border border-slate-600/50 rounded-lg bg-slate-900/50 text-white placeholder-slate-500 disabled:opacity-50 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
          />
          <Button onClick={addLeader} disabled={disabled} variant="outline" size="sm" type="button" className="h-10">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {leaders.map((leader, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-blue-500/20 border border-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-sm">
              {leader}
              <button
                type="button"
                onClick={() => removeLeader(idx)}
                disabled={disabled}
                className="ml-1 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white">Members</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMember())}
            disabled={disabled}
            placeholder="Enter member name and press Enter"
            className="flex-1 px-4 py-2.5 border border-slate-600/50 rounded-lg bg-slate-900/50 text-white placeholder-slate-500 disabled:opacity-50 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
          />
          <Button onClick={addMember} disabled={disabled} variant="outline" size="sm" type="button" className="h-10">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {members.map((member, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-purple-500/20 border border-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm">
              {member}
              <button
                type="button"
                onClick={() => removeMember(idx)}
                disabled={disabled}
                className="ml-1 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white">Length</label>
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          disabled={disabled}
          placeholder="e.g., 3:45 or 3 min 45 sec"
          className="w-full px-4 py-2.5 border border-slate-600/50 rounded-lg bg-slate-900/50 text-white placeholder-slate-500 disabled:opacity-50 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={disabled}
          placeholder="Any additional notes about the performance"
          rows={3}
          className="w-full px-4 py-2.5 border border-slate-600/50 rounded-lg bg-slate-900/50 text-white placeholder-slate-500 disabled:opacity-50 resize-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors"
        />
      </div>

      <Button type="submit" disabled={disabled} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5">
        Continue to Lighting Editor
      </Button>
    </form>
  )
}
