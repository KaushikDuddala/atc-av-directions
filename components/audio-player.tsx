"use client"

import type React from "react"

import { useRef, useState, useEffect, useCallback } from "react"
import type { AudioGroup } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"

export function AudioPlayer({
  group,
  onTimeUpdate,
}: {
  group: AudioGroup
  onTimeUpdate: (time: number) => void
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const onTimeUpdateRef = useRef(onTimeUpdate)

  // Keep ref updated
  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate
  }, [onTimeUpdate])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      const timeMs = audio.currentTime * 1000
      setCurrentTime(timeMs)
      onTimeUpdateRef.current(timeMs)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration * 1000)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
    }
  }, [])

  // When group changes, reset player state
  useEffect(() => {
    const audio = audioRef.current
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    if (audio) {
      audio.currentTime = 0
      audio.pause()
    }
  }, [group.id, group.audioUrl])

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(console.error)
    }
  }, [isPlaying])

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    audioRef.current.currentTime = newTime / 1000
    setCurrentTime(newTime)
    onTimeUpdate(newTime)
  }

  const minutes = Math.floor(currentTime / 60000)
  const seconds = Math.floor((currentTime % 60000) / 1000)
  const durationMinutes = Math.floor(duration / 60000)
  const durationSeconds = Math.floor((duration % 60000) / 1000)
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  const audioSrc = group.audioUrl || group.info?.audioLink || ""

  return (
    <div className="w-full space-y-4">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        playsInline
      />

      <div className="space-y-2">
        <div
          className="h-2 bg-muted rounded-full overflow-hidden cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-foreground transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground font-mono">
          <span>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
          <span>
            {durationMinutes}:{durationSeconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <Button onClick={togglePlayPause} size="lg" className="w-full">
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Play Audio
          </>
        )}
      </Button>
    </div>
  )
}
