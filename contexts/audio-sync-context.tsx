"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  getSocket,
  emitPlaybackState,
  emitGroupChange,
  onPlaybackStateChange,
  onGroupChange,
  onConnect,
  offConnect,
  type PlaybackState,
  type GroupChange,
} from "@/lib/audio-sync"

interface AudioSyncContextType {
  playbackState: PlaybackState | null
  groupChange: GroupChange | null
  isConnected: boolean
  updatePlaybackState: (state: PlaybackState) => void
  updateGroupChange: (change: GroupChange) => void
}

const AudioSyncContext = createContext<AudioSyncContextType | undefined>(undefined)

export function AudioSyncProvider({ children }: { children: React.ReactNode }) {
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null)
  const [groupChange, setGroupChange] = useState<GroupChange | null>(null)
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
    const unsubscribePlayback = onPlaybackStateChange((state: PlaybackState) => {
      setPlaybackState(state)
    })

    // Listen for group changes from other clients
    const unsubscribeGroup = onGroupChange((change: GroupChange) => {
      setGroupChange(change)
    })

    onConnect(handleConnect)
    socket.on("disconnect", handleDisconnect)

    if (socket.connected) {
      setIsConnected(true)
    }

    return () => {
      unsubscribePlayback()
      unsubscribeGroup()
      offConnect(handleConnect)
      socket.off("disconnect", handleDisconnect)
    }
  }, [])

  const updatePlaybackState = useCallback((state: PlaybackState) => {
    setPlaybackState(state)
    emitPlaybackState(state)
  }, [])

  const updateGroupChange = useCallback((change: GroupChange) => {
    setGroupChange(change)
    emitGroupChange(change)
  }, [])

  return (
    <AudioSyncContext.Provider value={{ playbackState, groupChange, isConnected, updatePlaybackState, updateGroupChange }}>
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
