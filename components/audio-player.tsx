"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
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

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime * 1000) // Convert to ms
      onTimeUpdate(audio.currentTime * 1000)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration * 1000) // Convert to ms
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [onTimeUpdate])

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    audioRef.current.currentTime = newTime / 1000 // Convert back to seconds
    setCurrentTime(newTime)
  }

  const minutes = Math.floor(currentTime / 60000)
  const seconds = Math.floor((currentTime % 60000) / 1000)
  const durationMinutes = Math.floor(duration / 60000)
  const durationSeconds = Math.floor((duration % 60000) / 1000)

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="w-full space-y-4">
      <audio ref={audioRef} src={group.audioUrl} />

      <div className="space-y-2">
        <div
          className="h-1 bg-muted rounded-full overflow-hidden cursor-pointer hover:h-2 transition-all"
          onClick={handleSeek}
        >
          <div className="h-full bg-foreground transition-all duration-100" style={{ width: `${progressPercent}%` }} />
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
