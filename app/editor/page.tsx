"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle2, ChevronLeft, Download, Eye, Music4 } from "lucide-react"
import { PerformanceForm, type PerformanceFormData } from "@/components/performance-form"
import { AudioUpload, type AudioUploadResult } from "@/components/audio-upload"
import { LightingTimeline } from "@/components/lighting-timeline"
import { LightingPreviewModal } from "@/components/lighting-preview-modal"
import { Button } from "@/components/ui/button"
import { usePerformanceDatabase } from "@/lib/hooks/usePerformanceDatabase"
import type { AudioGroup, Direction } from "@/lib/types"

type EditorStep = "form" | "warning" | "editor"

export default function EditorPage() {
  const router = useRouter()
  const { savePerformance } = usePerformanceDatabase()

  const [step, setStep] = useState<EditorStep>("form")
  const [performance, setPerformance] = useState<AudioGroup | null>(null)
  const [audioResult, setAudioResult] = useState<AudioUploadResult | null>(null)
  const [selectedTimestamp, setSelectedTimestamp] = useState<number | undefined>()
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [hasViewedPreview, setHasViewedPreview] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!audioRef.current || !performance) return
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, performance])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime * 1000)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [performance])

  const handlePerformanceSubmit = (data: PerformanceFormData, audio?: AudioUploadResult) => {
    if (!audio) return

    const newPerformance: AudioGroup = {
      id: `perf-${Date.now()}`,
      name: data.name,
      audioUrl: URL.createObjectURL(audio.file),
      duration: audio.duration,
      performanceType: data.performanceType,
      performanceTypeOther: data.performanceTypeOther,
      directions: [],
      info: {
        startTime: data.length,
        endTime: "",
        leaders: data.leaders,
        members: data.members,
        equipment: [],
        directionsLink: "",
        audioLink: "",
        notes: data.notes,
      },
    }

    setPerformance(newPerformance)
    setAudioResult(audio)
    setCurrentTime(0)
    setIsPlaying(false)
    setStep("warning")
  }

  const handleExport = () => {
    if (!performance) return
    const exportData = { ...performance, audioUrl: "" }
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${performance.name.replace(/\s+/g, "_")}_directions.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleSavePerformance = async () => {
    if (!performance || !audioResult) return

    if (!hasViewedPreview) {
      setShowPreview(true)
      return
    }

    setIsSaving(true)
    try {
      const result = await savePerformance(performance, audioResult.file)
      if (result.success) {
        setPerformance(null)
        setAudioResult(null)
        setStep("form")
        setSelectedTimestamp(undefined)
        setHasViewedPreview(false)
        router.push("/")
      } else {
        alert("Failed to save performance: " + JSON.stringify(result.error))
      }
    } catch (error) {
      console.error("Error saving performance:", error)
      alert("An error occurred while saving the performance")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSeek = (time: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time / 1000
    setCurrentTime(time)
  }

  const handleAudioReplace = (audio: AudioUploadResult) => {
    if (!performance) return

    const nextDuration = audio.duration
    const nextDirections = performance.directions
      .map((direction) => {
        const startTime = Math.min(direction.startTime, nextDuration)
        const endTime = Math.min(direction.endTime, nextDuration)
        if (startTime >= nextDuration || endTime <= startTime) return null
        return { ...direction, startTime, endTime }
      })
      .filter(Boolean) as Direction[]

    setAudioResult(audio)
    setPerformance({
      ...performance,
      audioUrl: URL.createObjectURL(audio.file),
      duration: nextDuration,
      directions: nextDirections,
    })
    setCurrentTime(0)
    setIsPlaying(false)
    setSelectedTimestamp(undefined)
    setHasViewedPreview(false)
    if (audioRef.current) audioRef.current.currentTime = 0
  }

  if (step === "form") {
    return (
      <div className="page-shell">
        <div className="page-content page-content-wide">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
              Back home
            </Link>
          </Button>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section className="soft-card-strong p-8 sm:p-10">
              <p className="section-kicker border-none bg-amber-100/70 text-amber-800 shadow-none">Step 1 of 3</p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">Create a performance</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
                Start with the basics, then move into the cue editor once the audio and performer details are ready.
              </p>

              <div className="mt-8">
                <PerformanceForm onSubmit={handlePerformanceSubmit} />
              </div>
            </section>

            <aside className="space-y-5">
              <div className="soft-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">What happens next</p>
                <div className="mt-4 space-y-4 text-sm leading-6 text-stone-600">
                  <div className="summary-pill w-full justify-start">1. Add the track and performer info</div>
                  <div className="summary-pill w-full justify-start">2. Review the cue timing reminder</div>
                  <div className="summary-pill w-full justify-start">3. Build cues and preview before saving</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    )
  }

  if (step === "warning" && performance) {
    return (
      <div className="page-shell">
        <div className="page-content flex min-h-screen items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="soft-card-strong p-8 sm:p-10">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-100 p-3 text-amber-700">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Step 2 of 3</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">Cue timing reminder</h1>
                  <p className="mt-3 text-base leading-7 text-stone-600">
                    Lighting shifts need a little lead time. Keep these points in mind before you start placing cues.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                {[
                  "Very fast changes can be missed by the audience.",
                  "Transitions need time to physically happen.",
                  "Place the cue slightly before the exact moment you want the effect.",
                  "Use the preview before saving so the timing feels right.",
                ].map((tip) => (
                  <div key={tip} className="summary-pill w-full justify-start rounded-2xl px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPerformance(null)
                    setAudioResult(null)
                    setStep("form")
                  }}
                >
                  Go back
                </Button>
                <Button type="button" onClick={() => setStep("editor")}>
                  I understand, continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "editor" && performance) {
    const performanceTypeLabel = performance.performanceType === "other"
      ? performance.performanceTypeOther
      : performance.performanceType

    return (
      <div className="page-shell">
        <div className="page-content page-content-wide">
          <section className="soft-card-strong p-6 sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <button type="button" onClick={() => setStep("warning")} className="summary-pill mt-1">
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Step 3 of 3</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{performance.name}</h1>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {performanceTypeLabel && <div className="summary-pill">{performanceTypeLabel}</div>}
                    {performance.info.leaders.length > 0 && (
                      <div className="summary-pill">Led by {performance.info.leaders.join(", ")}</div>
                    )}
                    <div className="summary-pill">{performance.directions.length} cue{performance.directions.length === 1 ? "" : "s"}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-start gap-3">
                <div className="soft-card min-w-[260px] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Audio</p>
                      <p className="mt-2 text-sm font-semibold text-stone-900">{audioResult?.name}</p>
                      <p className="mt-1 text-xs text-stone-500">{Math.round(performance.duration / 1000)} seconds</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200">
                      <Music4 className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <AudioUpload onUpload={handleAudioReplace} label="Change audio" />
                  </div>
                </div>
                <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button type="button" variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </section>

          <section className="soft-card mt-5 p-2 sm:p-3">
            <audio ref={audioRef} src={performance.audioUrl} crossOrigin="anonymous" />
            <div className="h-[calc(100vh-12rem)] min-h-[760px] overflow-hidden rounded-[30px]">
              <LightingTimeline
                duration={performance.duration}
                directions={performance.directions}
                onDirectionsChange={(directions) => {
                  setPerformance((previous) => (previous ? { ...previous, directions } : previous))
                  setHasViewedPreview(false)
                }}
                currentTime={currentTime}
                onSeek={handleSeek}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                selectedTimestamp={selectedTimestamp}
                onSelectCue={(timestamp) => setSelectedTimestamp(timestamp)}
              />
            </div>
          </section>

          <section className="soft-card mt-5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm font-semibold text-stone-800">
                {performance.directions.length} cue{performance.directions.length === 1 ? "" : "s"} created
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPerformance(null)
                    setAudioResult(null)
                    setStep("form")
                    setSelectedTimestamp(undefined)
                    setHasViewedPreview(false)
                  }}
                >
                  Start over
                </Button>
                <Button
                  type="button"
                  onClick={handleSavePerformance}
                  disabled={isSaving || (!hasViewedPreview && performance.directions.length > 0)}
                  className={!hasViewedPreview && performance.directions.length > 0 ? "bg-stone-400 border-stone-400 hover:translate-y-0 hover:bg-stone-400 hover:shadow-none" : undefined}
                >
                  {isSaving
                    ? "Saving..."
                    : hasViewedPreview || performance.directions.length === 0
                      ? "Save performance"
                      : "Preview required"}
                </Button>
              </div>
            </div>
          </section>

          {showPreview && performance && (
            <LightingPreviewModal
              group={performance}
              onClose={() => setShowPreview(false)}
              onConfirm={() => {
                setHasViewedPreview(true)
                setShowPreview(false)
              }}
            />
          )}
        </div>
      </div>
    )
  }

  return null
}
