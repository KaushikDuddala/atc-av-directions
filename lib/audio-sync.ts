import { io, Socket } from "socket.io-client"

export interface PlaybackState {
  groupId: string
  isPlaying: boolean
  currentTime: number
  timestamp: number
}

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    // Connect to Socket.io server
    // The server is running on the same host
    const socketUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
    
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

export function onPlaybackStateChange(
  callback: (state: PlaybackState) => void
) {
  const socket = getSocket()
  socket.on("playback:update", callback)
  return () => socket.off("playback:update", callback)
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
