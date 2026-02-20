import { io, Socket } from "socket.io-client"
import { getSocketUrl } from "./socket-config"

export interface PlaybackState {
  groupId: string
  isPlaying: boolean
  currentTime: number
  timestamp: number
}

export interface GroupChange {
  groupId: string
  timestamp: number
}

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    const socketUrl = getSocketUrl()
    console.log("[Socket.io] Connecting to", socketUrl)
    
    socket = io(socketUrl, {
      path: "/socket.io",
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })
  }
  return socket
}

export function emitPlaybackState(state: PlaybackState) {
  const socket = getSocket()
  socket.emit("playback:update", state)
}

export function emitGroupChange(change: GroupChange) {
  const socket = getSocket()
  socket.emit("group:change", change)
}

export function onPlaybackStateChange(
  callback: (state: PlaybackState) => void
) {
  const socket = getSocket()
  socket.on("playback:update", callback)
  return () => socket.off("playback:update", callback)
}

export function onGroupChange(
  callback: (change: GroupChange) => void
) {
  const socket = getSocket()
  socket.on("group:change", callback)
  return () => socket.off("group:change", callback)
}

export function onConnect(callback: () => void) {
  const socket = getSocket()
  if (socket.connected) {
    callback()
  }
  socket.on("connect", callback)
}

export function offConnect(callback: () => void) {
  const socket = getSocket()
  socket.off("connect", callback)
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
