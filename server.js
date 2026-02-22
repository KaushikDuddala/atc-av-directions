// Import dependencies
const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const { Server: SocketIOServer } = require("socket.io")

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = parseInt(process.env.PORT || "3000", 10)

// Create Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Prepare the app
app.prepare().then(() => {
  // Create HTTP server
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error("Error handling request:", err)
      res.statusCode = 500
      res.end("Internal server error")
    }
  })

  // Initialize Socket.io
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === "production" 
        ? ["https://tams-av.vercel.app", "tams-av.vercel.app"]
        : "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io",
  })

  // Handle Socket.io connections
  io.on("connection", (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`)

    // Handle playback state updates
    socket.on("playback:update", (state) => {
      console.log(`[Socket.io] Playback update from ${socket.id}:`, state)
      // Broadcast to all clients except the sender
      socket.broadcast.emit("playback:update", state)
    })

    // Handle group changes
    socket.on("group:change", (change) => {
      console.log(`[Socket.io] Group change from ${socket.id}:`, change)
      // Broadcast to all clients except the sender
      socket.broadcast.emit("group:change", change)
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`)
    })

    // Handle errors
    socket.on("error", (error) => {
      console.error(`[Socket.io] Error from ${socket.id}:`, error)
    })
  })

  // Start the server
  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
    if (dev) {
      console.log(`> Socket.io server running on ws://${hostname}:${port}`)
    }
  })
})
