"use client"

import { useState } from "react"
import { Music4, Users, X } from "lucide-react"
import { Button } from "./ui/button"
import type { PerformanceType } from "@/lib/types"
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
    if (!leaderInput.trim()) return
    setLeaders([...leaders, leaderInput.trim()])
    setLeaderInput("")
  }

  const addMember = () => {
    if (!memberInput.trim()) return
    setMembers([...members, memberInput.trim()])
    setMemberInput("")
  }

  const removeLeader = (index: number) => {
    setLeaders(leaders.filter((_, i) => i !== index))
  }

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!name.trim()) {
      alert("Please enter a performance name")
      return
    }

    if (!audioResult) {
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
      audioResult,
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <section className="soft-card-strong p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-100 p-3 text-amber-700">
            <Music4 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Performance basics</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">What is this act?</h2>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="field-label">Performance name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={disabled}
              placeholder="Example: Sam & Saha dance performance"
              className="field-input"
            />
          </div>

          <div>
            <label className="field-label">Audio file</label>
            <div className="muted-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-800">
                  {audioResult ? audioResult.name : "No file selected yet"}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  {audioResult ? `${(audioResult.duration / 1000).toFixed(1)} seconds detected` : "Upload the track used during the performance."}
                </p>
              </div>
              <AudioUpload onUpload={setAudioResult} disabled={disabled} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label">Performance type</label>
              <select
                value={performanceType}
                onChange={(event) => setPerformanceType(event.target.value as PerformanceType)}
                disabled={disabled}
                className="field-select"
              >
                <option value="dance">Dance</option>
                <option value="music">Music</option>
                <option value="singing">Singing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="field-label">Announced length</label>
              <input
                type="text"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                disabled={disabled}
                placeholder="Example: 3:45"
                className="field-input"
              />
            </div>
          </div>

          {performanceType === "other" && (
            <div>
              <label className="field-label">Describe the performance type</label>
              <input
                type="text"
                value={performanceTypeOther}
                onChange={(event) => setPerformanceTypeOther(event.target.value)}
                disabled={disabled}
                placeholder="Example: spoken word"
                className="field-input"
              />
            </div>
          )}

          <div>
            <label className="field-label">Notes for the team</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              disabled={disabled}
              placeholder="Anything the lighting or stage team should know."
              rows={5}
              className="field-textarea"
            />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="soft-card p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-3 text-emerald-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">People</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">Who should be listed?</h2>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label className="field-label">Leaders</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={leaderInput}
                  onChange={(event) => setLeaderInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      addLeader()
                    }
                  }}
                  disabled={disabled}
                  placeholder="Add a leader name"
                  className="field-input"
                />
                <Button type="button" variant="outline" onClick={addLeader} disabled={disabled}>
                  Add
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {leaders.map((leader, index) => (
                  <span key={`${leader}-${index}`} className="chip border-amber-200 bg-amber-100/70 text-amber-800">
                    {leader}
                    <button type="button" onClick={() => removeLeader(index)} disabled={disabled} className="text-amber-700/70 transition hover:text-amber-900">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="field-label">Members</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={memberInput}
                  onChange={(event) => setMemberInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      addMember()
                    }
                  }}
                  disabled={disabled}
                  placeholder="Add a member name"
                  className="field-input"
                />
                <Button type="button" variant="outline" onClick={addMember} disabled={disabled}>
                  Add
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {members.map((member, index) => (
                  <span key={`${member}-${index}`} className="chip border-emerald-200 bg-emerald-100/70 text-emerald-800">
                    {member}
                    <button type="button" onClick={() => removeMember(index)} disabled={disabled} className="text-emerald-700/70 transition hover:text-emerald-900">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="muted-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Before you continue</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-600">
            <li>Upload the exact audio file used at rehearsal or showtime.</li>
            <li>Add leaders so the schedule page is easier for performers to scan.</li>
            <li>Notes can be brief. The cue editor is where timing gets precise.</li>
          </ul>
        </div>

        <Button type="submit" disabled={disabled} size="lg" className="w-full">
          Continue to Cue Editing
        </Button>
      </section>
    </form>
  )
}
