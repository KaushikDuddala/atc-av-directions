"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LightingTimeline } from "@/components/lighting-timeline"
import { ChevronLeft, Save, Trash2 } from "lucide-react"
import { usePerformanceDatabase } from "@/lib/hooks/usePerformanceDatabase"
import type { AudioGroup, Direction } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { EditAuth } from "@/components/edit-auth"
import { EditLogout } from "@/components/edit-logout"

function EditPageContent() {
  const { getPerformances, updatePerformance, deletePerformance } = usePerformanceDatabase()
  const audioRef = useRef<HTMLAudioElement>(null)
  const rafRef   = useRef<number | null>(null)

  const [performances,        setPerformances]        = useState<AudioGroup[]>([])
  const [selectedPerformance, setSelectedPerformance] = useState<AudioGroup | null>(null)
  const [editingPerformance,  setEditingPerformance]  = useState<AudioGroup | null>(null)
  const [loading,             setLoading]             = useState(true)
  const [currentTime,         setCurrentTime]         = useState(0)
  const [isPlaying,           setIsPlaying]           = useState(false)
  const [isSaving,            setIsSaving]            = useState(false)

  // ── Load performances ──────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const result = await getPerformances()
        if (result.success && result.data) {
          const withAudio = await Promise.all(
            result.data.map(async (perf: any) => {
              let audioUrl = ""
              if (perf.audio_path) {
                const { data } = supabase.storage
                  .from("performance-audio")
                  .getPublicUrl(perf.audio_path)
                audioUrl = data.publicUrl
              }
              return {
                id:                   perf.id,
                name:                 perf.name,
                audioUrl,
                duration:             perf.duration,
                performanceType:      perf.performance_type,
                performanceTypeOther: perf.performance_type_other,
                directions:           perf.directions || [],
                info:                 perf.info       || {},
              } as AudioGroup
            })
          )
          setPerformances(withAudio)
        }
      } catch (err) {
        console.error("Error loading performances:", err)
        alert("Failed to load performances")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getPerformances])

  // ── rAF loop — drives smooth 60fps playhead position from audio element ────
  useEffect(() => {
    const tick = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime * 1000)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isPlaying])

  // ── Audio play/pause ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!audioRef.current || !selectedPerformance) return
    if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false))
    else           audioRef.current.pause()
  }, [isPlaying, selectedPerformance])

  // ── Audio ended ────────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnded = () => setIsPlaying(false)
    audio.addEventListener("ended", onEnded)
    return () => audio.removeEventListener("ended", onEnded)
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSelectPerformance = (perf: AudioGroup) => {
    setSelectedPerformance(perf)
    setEditingPerformance({ ...perf })
    setCurrentTime(0)
    setIsPlaying(false)
    if (audioRef.current) audioRef.current.currentTime = 0
  }

  const handleDirectionsChange = useCallback((directions: Direction[]) => {
    setSelectedPerformance(prev => prev ? { ...prev, directions } : prev)
  }, [])

  const handleSeek = useCallback((ms: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = ms / 1000
      setCurrentTime(ms)
    }
  }, [])

  const handleSave = async () => {
    if (!selectedPerformance) return
    // Apply any pending editingPerformance changes first
    const toSave = editingPerformance
      ? { ...selectedPerformance, name: editingPerformance.name, performanceType: editingPerformance.performanceType, performanceTypeOther: editingPerformance.performanceTypeOther, info: editingPerformance.info }
      : selectedPerformance
    setIsSaving(true)
    try {
      const result = await updatePerformance(toSave.id, toSave)
      if (result.success) {
        setSelectedPerformance(toSave)
        alert("Performance saved!")
      } else {
        alert("Failed to save performance")
      }
    } catch (err) {
      console.error("Error saving:", err)
      alert("Error saving performance")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedPerformance) return
    if (!confirm("Delete this performance? This cannot be undone.")) return
    try {
      const result = await deletePerformance(selectedPerformance.id)
      if (result.success) {
        setPerformances(prev => prev.filter(p => p.id !== selectedPerformance.id))
        setSelectedPerformance(null)
        setEditingPerformance(null)
      } else {
        alert("Failed to delete performance")
      }
    } catch (err) {
      console.error("Error deleting:", err)
      alert("Error deleting performance")
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading performances…</div>
      </div>
    )
  }

  // ── Performance list ───────────────────────────────────────────────────────
  if (!selectedPerformance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="mx-auto max-w-4xl">
          <Link href="/">
            <Button variant="ghost" className="mb-8 text-slate-400 hover:text-white">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="mb-8">
            <h1 className="text-5xl font-black mb-3 tracking-tight">Edit Performance</h1>
            <p className="text-lg text-slate-400">Select a performance to edit</p>
          </div>
          {performances.length === 0 ? (
            <div className="p-8 bg-slate-800/50 border border-slate-700/50 rounded-xl text-center">
              <p className="text-slate-400">No performances found. Create one first!</p>
              <Link href="/editor">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Create Performance</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {performances.map((perf) => (
                <button
                  key={perf.id}
                  onClick={() => handleSelectPerformance(perf)}
                  className="text-left p-6 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-blue-500/50 hover:bg-slate-800/70 transition-colors"
                >
                  <h2 className="text-xl font-bold text-white mb-2">{perf.name}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="text-slate-400">Type: <span className="text-white">{perf.performanceType}</span></div>
                    {perf.info?.leaders?.length > 0 && (
                      <div className="text-slate-400">Leaders: <span className="text-white">{perf.info.leaders.join(", ")}</span></div>
                    )}
                    {perf.info?.members?.length > 0 && (
                      <div className="text-slate-400">Members: <span className="text-white">{perf.info.members.length}</span></div>
                    )}
                    <div className="text-slate-400">Cues: <span className="text-white">{perf.directions?.length || 0}</span></div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Editor view ────────────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedPerformance(null); setIsPlaying(false) }} className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black">{selectedPerformance.name}</h1>
          <span className="text-sm text-slate-500">{selectedPerformance.performanceType}</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700 h-8 text-sm px-3">
            <Save className="w-3 h-3 mr-1.5" />
            {isSaving ? "Saving…" : "Save"}
          </Button>
          <Button onClick={handleDelete} variant="outline" className="text-red-400 border-red-500/30 h-8 text-sm px-3">
            <Trash2 className="w-3 h-3 mr-1.5" />
            Delete
          </Button>
          <EditLogout />
        </div>
      </div>

      {/* Body: edit form on left, timeline on right */}
      <div className="flex-1 min-h-0 flex gap-0 overflow-hidden">

        {/* Edit details panel — always visible */}
        {editingPerformance && (
          <div className="flex-shrink-0 w-64 border-r border-slate-700/50 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-900/40">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Performance Details</p>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Name</label>
              <input type="text" value={editingPerformance.name}
                onChange={e => setEditingPerformance({ ...editingPerformance, name: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-slate-600/50 rounded bg-slate-900/50 text-white focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Type</label>
              <select value={editingPerformance.performanceType}
                onChange={e => setEditingPerformance({ ...editingPerformance, performanceType: e.target.value as any })}
                className="w-full px-2 py-1.5 text-sm border border-slate-600/50 rounded bg-slate-900/50 text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="dance">Dance</option>
                <option value="music">Music</option>
                <option value="singing">Singing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Leaders</label>
              <textarea value={editingPerformance.info?.leaders?.join(", ") || ""}
                onChange={e => setEditingPerformance({ ...editingPerformance, info: { ...editingPerformance.info, leaders: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } })}
                placeholder="Comma separated" rows={2}
                className="w-full px-2 py-1.5 text-sm border border-slate-600/50 rounded bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Members</label>
              <textarea value={editingPerformance.info?.members?.join(", ") || ""}
                onChange={e => setEditingPerformance({ ...editingPerformance, info: { ...editingPerformance.info, members: e.target.value.split(",").map(s => s.trim()).filter(Boolean) } })}
                placeholder="Comma separated" rows={2}
                className="w-full px-2 py-1.5 text-sm border border-slate-600/50 rounded bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Notes</label>
              <textarea value={editingPerformance.info?.notes || ""}
                onChange={e => setEditingPerformance({ ...editingPerformance, info: { ...editingPerformance.info, notes: e.target.value } })}
                rows={3}
                className="w-full px-2 py-1.5 text-sm border border-slate-600/50 rounded bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
              />
            </div>

            <div className="mt-auto pt-2 border-t border-slate-700/50 text-xs text-slate-500">
              Changes apply on Save
            </div>
          </div>
        )}

        {/* Timeline — fills remaining space */}
        <div className="flex-1 min-w-0 p-3">
          <audio ref={audioRef} src={selectedPerformance.audioUrl} crossOrigin="anonymous" />
          <LightingTimeline
            duration={selectedPerformance.duration}
            directions={selectedPerformance.directions}
            onDirectionsChange={handleDirectionsChange}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(p => !p)}
            onSeek={handleSeek}
          />
        </div>

      </div>
    </div>
  )
}

export default function EditPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/edit/verify", {
          method: "GET",
        }).catch(() => null)
        
        // If GET fails (expected), we need to check with a server action
        const { isEditAuthenticated } = await import("@/lib/edit-auth")
        const authenticated = await isEditAuthenticated()
        setIsAuthenticated(authenticated)
      } catch (err) {
        setIsAuthenticated(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <EditAuth onAuthSuccess={() => setIsAuthenticated(true)} />
  }

  return <EditPageContent />
}