"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PerformanceForm, type PerformanceFormData } from "@/components/performance-form"
import { AudioUpload, type AudioUploadResult } from "@/components/audio-upload"
import { VideoTimelineEditor } from "@/components/video-timeline-editor"
import { LightingPreviewModal } from "@/components/lighting-preview-modal"
import { Button } from "@/components/ui/button"
import { usePerformanceDatabase } from "@/lib/hooks/usePerformanceDatabase"
import type { AudioGroup, Direction } from "@/lib/types"
import { Download, ChevronLeft, AlertTriangle, Eye } from "lucide-react"

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

  const handleAddCue = (timestamp: number) => {
    if (!performance) return
    const existingCue = performance.directions.find((d) => d.startTime === timestamp)
    if (existingCue) {
      setSelectedTimestamp(timestamp)
      return
    }
    const newCue: Direction = {
      startTime: timestamp,
      endTime: Math.min(timestamp + 2000, performance.duration),
      floodlight: {
        percent: 50,
        color: "#ffaa00",
        notes: "",
      },
      overhead: {
        percent: 50,
        notes: "",
      },
    }
    const updatedDirections = [...performance.directions, newCue].sort((a, b) => a.startTime - b.startTime)
    setPerformance({
      ...performance,
      directions: updatedDirections,
    })
    setSelectedTimestamp(timestamp)
    setHasViewedPreview(false)
  }

  const handleUpdateCue = (updatedCue: Direction) => {
    if (!performance) return
    const updatedDirections = performance.directions.map((d) =>
      d.startTime === updatedCue.startTime ? updatedCue : d
    )
    setPerformance({
      ...performance,
      directions: updatedDirections,
    })
    setHasViewedPreview(false)
  }

  const handleDeleteCue = (startTime: number) => {
    if (!performance) return
    const updatedDirections = performance.directions.filter((d) => d.startTime !== startTime)
    setPerformance({
      ...performance,
      directions: updatedDirections,
    })
    setSelectedTimestamp(undefined)
    setHasViewedPreview(false)
  }

  const handleDuplicateCue = (cue: Direction) => {
    if (!performance) return
    const newStartTime = cue.endTime + 2000
    const newEndTime = Math.min(newStartTime + (cue.endTime - cue.startTime), performance.duration)
    const newCue: Direction = {
      ...cue,
      startTime: newStartTime,
      endTime: newEndTime,
    }
    const updatedDirections = [...performance.directions, newCue].sort((a, b) => a.startTime - b.startTime)
    setPerformance({
      ...performance,
      directions: updatedDirections,
    })
    setSelectedTimestamp(newStartTime)
    setHasViewedPreview(false)
  }

  const handleExport = () => {
    if (!performance) return
    const exportData = {
      ...performance,
      audioUrl: "",
    }
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
    if (audioRef.current) {
      audioRef.current.currentTime = time / 1000
      setCurrentTime(time)
    }
  }

  // Step 1: Performance Form
  if (step === "form") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="mx-auto max-w-2xl">
          <Link href="/">
            <Button variant="ghost" className="mb-12 text-slate-400 hover:text-white">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="mb-10">
            <h1 className="text-5xl font-black mb-3 tracking-tight">Create Performance</h1>
            <p className="text-lg text-slate-400">Upload audio, add details, and set up lighting cues</p>
          </div>
          <PerformanceForm onSubmit={handlePerformanceSubmit} />
        </div>
      </div>
    )
  }

  // Step 2: Warning Dialog
  if (step === "warning" && performance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 flex items-center justify-center">
        <div className="mx-auto max-w-lg">
          <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl backdrop-blur space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-8 h-8" />
              <h1 className="text-2xl font-black tracking-tight">Before You Continue</h1>
            </div>

            <div className="space-y-3 text-slate-300">
              <p>Please note the following when setting up lighting cues:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span>Quick lighting changes (less than 2 seconds) may be unseen by the audience</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span>Light transitions need time to physically occur</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span>Set cues slightly before the moment you want the change</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span>Test your cues with the preview before saving</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setPerformance(null)
                  setAudioResult(null)
                  setStep("form")
                }}
                variant="outline"
                className="flex-1"
              >
                Go Back
              </Button>
              <Button
                onClick={() => setStep("editor")}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                I Understand - Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Video Timeline Editor
  if (step === "editor" && performance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
        <div className="px-4 py-4">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setStep("warning")}
                className="text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-black">{performance.name}</h1>
                <p className="text-sm text-slate-400">
                  {performance.performanceType && (
                    <>
                      {performance.performanceType === "other"
                        ? performance.performanceTypeOther
                        : performance.performanceType.charAt(0).toUpperCase() + performance.performanceType.slice(1)}
                      {" • "}
                    </>
                  )}
                  {performance.info.leaders.length > 0 && `Led by ${performance.info.leaders.join(", ")}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowPreview(true)}
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 pb-4">
          <audio ref={audioRef} src={performance.audioUrl} crossOrigin="anonymous" />
          <VideoTimelineEditor
            duration={performance.duration}
            directions={performance.directions}
            onAddCue={handleAddCue}
            onUpdateCue={handleUpdateCue}
            onDeleteCue={handleDeleteCue}
            onDuplicateCue={handleDuplicateCue}
            currentTime={currentTime}
            onSeek={handleSeek}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            selectedTimestamp={selectedTimestamp}
            onSelectCue={(ts) => setSelectedTimestamp(ts)}
          />
        </div>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              {performance.directions.length} cue{performance.directions.length !== 1 ? "s" : ""} created
              {!hasViewedPreview && performance.directions.length > 0 && (
                <span className="text-amber-400 ml-2">• Preview required before saving</span>
              )}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setPerformance(null)
                  setAudioResult(null)
                  setStep("form")
                  setSelectedTimestamp(undefined)
                  setHasViewedPreview(false)
                }}
                variant="outline"
              >
                Start Over
              </Button>
              <Button
                onClick={handleSavePerformance}
                disabled={isSaving || (!hasViewedPreview && performance.directions.length > 0)}
                className={`${hasViewedPreview || performance.directions.length === 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-600'}`}
              >
                {isSaving ? "Saving..." : hasViewedPreview || performance.directions.length === 0 ? "Save Performance" : "Preview Required"}
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
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
    )
  }

  return null
}
