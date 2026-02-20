import { Server as SocketIOServer } from "socket.io"
import type { NextApiRequest, NextApiResponse } from "next"

declare global {
  var io: SocketIOServer | undefined
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket) {
    res.status(500).json({ error: "socket not available" })
    return
  }

  const io = global.io || new SocketIOServer((res.socket as any).server)

  if (!global.io) {
    global.io = io
    console.log("Socket.io initialized")

    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`)

      // Broadcast playback state to all other clients
      socket.on("playback:update", (state) => {
        console.log(`Playback update from ${socket.id}:`, state)
        // Broadcast to all clients except the sender
        socket.broadcast.emit("playback:update", state)
      })

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`)
      })
    })
  }

  res.end()
}

