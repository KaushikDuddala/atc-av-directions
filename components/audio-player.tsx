"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import type { AudioGroup } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { useAudioSync } from "@/contexts/audio-sync-context"

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
  const { playbackState, updatePlaybackState, isConnected } = useAudioSync()
  const isApplyingRemoteState = useRef(false)

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

  // Listen for playback state changes from other clients
  useEffect(() => {
    if (!playbackState || !isConnected) return
    
    // Only sync if the group ID matches
    if (playbackState.groupId !== group.id) return

    const audio = audioRef.current
    if (!audio) return

    isApplyingRemoteState.current = true

    try {
      // Calculate time difference to determine if we need to seek
      const timeDiff = Math.abs(playbackState.currentTime - audio.currentTime * 1000)
      
      // If time difference is significant (more than 500ms), seek to the remote time
      if (timeDiff > 500) {
        audio.currentTime = playbackState.currentTime / 1000
      }

      // Sync play/pause state
      if (playbackState.isPlaying && !isPlaying) {
        audio.play().catch((err) => {
          console.warn("Failed to sync play state:", err)
        })
        setIsPlaying(true)
      } else if (!playbackState.isPlaying && isPlaying) {
        audio.pause()
        setIsPlaying(false)
      }
    } finally {
      isApplyingRemoteState.current = false
    }
  }, [playbackState, isConnected, group.id, isPlaying])

  // When group changes, reset player state and ensure the new source is loaded
  useEffect(() => {
    const audio = audioRef.current
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    if (audio) {
      // Ensure the new src is picked up by the element
      try {
        audio.load()
      } catch (e) {
        // ignore load errors
      }
    }
  }, [group])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      
      // Broadcast pause event
      if (isConnected) {
        updatePlaybackState({
          groupId: group.id,
          isPlaying: false,
          currentTime: audio.currentTime * 1000,
          timestamp: Date.now(),
        })
      }
      return
    }

    // play() returns a promise in modern browsers; handle rejections (e.g., autoplay policy)
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true)
          
          // Broadcast play event
          if (isConnected) {
            updatePlaybackState({
              groupId: group.id,
              isPlaying: true,
              currentTime: audio.currentTime * 1000,
              timestamp: Date.now(),
            })
          }
        })
        .catch((err) => {
          console.warn("Audio play failed:", err)
          setIsPlaying(false)
        })
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    audioRef.current.currentTime = newTime / 1000 // Convert back to seconds
    setCurrentTime(newTime)

    // Broadcast seek event
    if (isConnected) {
      updatePlaybackState({
        groupId: group.id,
        isPlaying: isPlaying,
        currentTime: newTime,
        timestamp: Date.now(),
      })
    }
  }

  const minutes = Math.floor(currentTime / 60000)
  const seconds = Math.floor((currentTime % 60000) / 1000)
  const durationMinutes = Math.floor(duration / 60000)
  const durationSeconds = Math.floor((duration % 60000) / 1000)

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="w-full space-y-4">
      {/* prefer explicit audioUrl, fallback to info.audioLink; ensure absolute/public path is used */}
      <audio
        ref={audioRef}
        src={group.audioUrl || group.info?.audioLink || ""}
        preload="metadata"
        playsInline
      />

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
