"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LightingTimeline } from "@/components/lighting-timeline"
import { usePerformanceDatabase } from "@/lib/hooks/usePerformanceDatabase"
import type { AudioGroup, Direction } from "@/lib/types"
import { supabase } from "@/lib/supabase"

function EditPageContent() {
  const { getPerformances, updatePerformance } = usePerformanceDatabase()
  const audioRef = useRef<HTMLAudioElement>(null)
  const rafRef = useRef<number | null>(null)

  const [performances, setPerformances] = useState<AudioGroup[]>([])
  const [selectedPerformance, setSelectedPerformance] = useState<AudioGroup | null>(null)
  const [editingPerformance, setEditingPerformance] = useState<AudioGroup | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getPerformances()
        if (result.success && result.data) {
          const withAudio = await Promise.all(
            result.data.map(async (perf: any) => {
              let audioUrl = ""
              if (perf.audio_path) {
                const { data } = supabase.storage.from("performance-audio").getPublicUrl(perf.audio_path)
                audioUrl = data.publicUrl
              }

              return {
                id: perf.id,
                name: perf.name,
                audioUrl,
                duration: perf.duration,
                performanceType: perf.performance_type,
                performanceTypeOther: perf.performance_type_other,
                directions: perf.directions || [],
                info: perf.info || {},
              } as AudioGroup
            }),
          )
          setPerformances(withAudio)
        }
      } catch (error) {
        console.error("Error loading performances:", error)
        alert("Failed to load performances")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [getPerformances])

  useEffect(() => {
    const tick = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime * 1000)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick)
    } else if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (!audioRef.current || !selectedPerformance) return
    if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false))
    else audioRef.current.pause()
  }, [isPlaying, selectedPerformance])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnded = () => setIsPlaying(false)
    audio.addEventListener("ended", onEnded)
    return () => audio.removeEventListener("ended", onEnded)
  }, [])

  const handleSelectPerformance = (performance: AudioGroup) => {
    setSelectedPerformance(performance)
    setEditingPerformance({ ...performance })
    setCurrentTime(0)
    setIsPlaying(false)
    if (audioRef.current) audioRef.current.currentTime = 0
  }

  const handleDirectionsChange = useCallback((directions: Direction[]) => {
    setSelectedPerformance((previous) => (previous ? { ...previous, directions } : previous))
  }, [])

  const handleSeek = useCallback((ms: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = ms / 1000
    setCurrentTime(ms)
  }, [])

  const handleSave = async () => {
    if (!selectedPerformance) return
    const toSave = editingPerformance
      ? {
          ...selectedPerformance,
          name: editingPerformance.name,
          performanceType: editingPerformance.performanceType,
          performanceTypeOther: editingPerformance.performanceTypeOther,
          info: editingPerformance.info,
        }
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
    } catch (error) {
      console.error("Error saving:", error)
      alert("Error saving performance")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-content flex min-h-screen items-center justify-center">
          <div className="soft-card px-8 py-6 text-stone-600">Loading performances…</div>
        </div>
      </div>
    )
  }

  if (!selectedPerformance) {
    return (
      <div className="page-shell">
        <div className="page-content">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
              Back home
            </Link>
          </Button>

          <section className="soft-card-strong mt-5 p-8 sm:p-10">
            <p className="section-kicker border-none bg-sky-100/70 text-sky-800 shadow-none">Saved performances</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">Edit a saved performance</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
              Pick a performance to reopen the cue timeline, update performer details, or remove an entry entirely.
            </p>
          </section>

          <section className="mt-5">
            {performances.length === 0 ? (
              <div className="soft-card p-10 text-center">
                <p className="text-lg font-semibold text-stone-900">No performances found yet.</p>
                <p className="mt-2 text-sm text-stone-600">Create one first, then come back here to edit it.</p>
                <Button asChild className="mt-5">
                  <Link href="/editor">Create a performance</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {performances.map((performance) => (
                  <button
                    key={performance.id}
                    onClick={() => handleSelectPerformance(performance)}
                    className="soft-card cursor-pointer p-6 text-left transition hover:-translate-y-1 hover:border-white hover:shadow-[0_32px_80px_-42px_rgba(72,41,18,0.32)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-stone-900">{performance.name}</h2>
                        <div className="mt-3 flex flex-wrap gap-2 text-sm text-stone-600">
                          {performance.performanceType && <span className="summary-pill">{performance.performanceType}</span>}
                          {performance.info?.members?.length > 0 && <span className="summary-pill">{performance.info.members.length} members</span>}
                        </div>
                      </div>
                    </div>
                    {performance.info?.leaders?.length > 0 && (
                      <p className="mt-4 text-sm leading-6 text-stone-600">
                        Led by {performance.info.leaders.join(", ")}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="page-content page-content-wide flex min-h-screen flex-col">
        <section className="soft-card-strong p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <button
                onClick={() => {
                  setSelectedPerformance(null)
                  setIsPlaying(false)
                }}
                className="summary-pill mt-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-stone-900">{selectedPerformance.name}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedPerformance.performanceType && <div className="summary-pill">{selectedPerformance.performanceType}</div>}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </section>

        <div className="mt-5 grid flex-1 min-h-0 gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          {editingPerformance && (
            <section className="soft-card-strong flex min-h-0 flex-col p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Performance details</p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="field-label">Name</label>
                  <input
                    type="text"
                    value={editingPerformance.name}
                    onChange={(event) => setEditingPerformance({ ...editingPerformance, name: event.target.value })}
                    className="field-input"
                  />
                </div>

                <div>
                  <label className="field-label">Type</label>
                  <select
                    value={editingPerformance.performanceType}
                    onChange={(event) => setEditingPerformance({ ...editingPerformance, performanceType: event.target.value as any })}
                    className="field-select"
                  >
                    <option value="dance">Dance</option>
                    <option value="music">Music</option>
                    <option value="singing">Singing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="field-label">Leaders</label>
                  <textarea
                    value={editingPerformance.info?.leaders?.join(", ") || ""}
                    onChange={(event) =>
                      setEditingPerformance({
                        ...editingPerformance,
                        info: {
                          ...editingPerformance.info,
                          leaders: event.target.value.split(",").map((value) => value.trim()).filter(Boolean),
                        },
                      })
                    }
                    placeholder="Comma separated"
                    rows={3}
                    className="field-textarea min-h-[96px]"
                  />
                </div>

                <div>
                  <label className="field-label">Members</label>
                  <textarea
                    value={editingPerformance.info?.members?.join(", ") || ""}
                    onChange={(event) =>
                      setEditingPerformance({
                        ...editingPerformance,
                        info: {
                          ...editingPerformance.info,
                          members: event.target.value.split(",").map((value) => value.trim()).filter(Boolean),
                        },
                      })
                    }
                    placeholder="Comma separated"
                    rows={3}
                    className="field-textarea min-h-[96px]"
                  />
                </div>

                <div>
                  <label className="field-label">Notes</label>
                  <textarea
                    value={editingPerformance.info?.notes || ""}
                    onChange={(event) =>
                      setEditingPerformance({
                        ...editingPerformance,
                        info: { ...editingPerformance.info, notes: event.target.value },
                      })
                    }
                    rows={5}
                    className="field-textarea"
                  />
                </div>
              </div>

            </section>
          )}

          <section className="soft-card min-h-0 p-2 sm:p-3">
            <audio ref={audioRef} src={selectedPerformance.audioUrl} crossOrigin="anonymous" />
            <div className="h-[calc(100vh-12rem)] min-h-[760px] overflow-hidden rounded-[30px]">
              <LightingTimeline
                duration={selectedPerformance.duration}
                directions={selectedPerformance.directions}
                onDirectionsChange={handleDirectionsChange}
                currentTime={currentTime}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying((playing) => !playing)}
                onSeek={handleSeek}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function EditPage() {
  return <EditPageContent />
}
