"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  getSocket,
  emitPlaybackState,
  onPlaybackStateChange,
  onConnect,
  offConnect,
  type PlaybackState,
} from "@/lib/audio-sync"

interface AudioSyncContextType {
  playbackState: PlaybackState | null
  isConnected: boolean
  updatePlaybackState: (state: PlaybackState) => void
}

const AudioSyncContext = createContext<AudioSyncContextType | undefined>(undefined)

export function AudioSyncProvider({ children }: { children: React.ReactNode }) {
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket
    const socket = getSocket()

    // Handle connection
    const handleConnect = () => {
      setIsConnected(true)
    }

    const handleDisconnect = () => {
      setIsConnected(false)
    }

    // Listen for playback state changes from other clients
    const unsubscribe = onPlaybackStateChange((state: PlaybackState) => {
      setPlaybackState(state)
    })

    onConnect(handleConnect)
    socket.on("disconnect", handleDisconnect)

    if (socket.connected) {
      setIsConnected(true)
    }

    return () => {
      unsubscribe()
      offConnect(handleConnect)
      socket.off("disconnect", handleDisconnect)
    }
  }, [])

  const updatePlaybackState = useCallback((state: PlaybackState) => {
    setPlaybackState(state)
    emitPlaybackState(state)
  }, [])

  return (
    <AudioSyncContext.Provider value={{ playbackState, isConnected, updatePlaybackState }}>
      {children}
    </AudioSyncContext.Provider>
  )
}

export function useAudioSync() {
  const context = useContext(AudioSyncContext)
  if (context === undefined) {
    throw new Error("useAudioSync must be used within AudioSyncProvider")
  }
  return context
}
