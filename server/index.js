const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const { Server } = require("socket.io")
const dotenv = require("dotenv").config()
const PORT = process.env.PORT || 5000
const router = express.Router()

app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_HOST,
    methods: ["GET", "POST"],
  },
})

router.get("/", (req, res) => {
  res.send("Server Running")
})

io.on("connection", (socket) => {
  console.log("User connected", socket.id)

  socket.on("join_room", (roomId) => {
    socket.join(roomId)
    console.log(`User ${socket.id} joined room ${roomId}`)
  })

  socket.on("send_message", (data) => {
    console.log(data)
    socket.to(data.roomID).emit("receive_message", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id)
  })
})

server.listen(PORT, () => {
  console.log("Server Running on port", PORT)
})
