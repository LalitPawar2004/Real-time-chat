require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')
const connectDB = require('./config/db')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const Message = require('./models/Message')
const Conversation = require('./models/Conversation')

const app = express()
const server = http.createServer(app)

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const io = new Server(server, { cors: { origin: CLIENT_URL, credentials: true } })

connectDB()

app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/chat', require('./routes/chat'))
app.use('/api/users', require('./routes/user'))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

const onlineUsers = new Set()

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('No token'))
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = decoded.id
    next()
  } catch {
    next(new Error('Auth error'))
  }
})

io.on('connection', async (socket) => {
  const userId = socket.userId
  onlineUsers.add(userId)
  await User.findByIdAndUpdate(userId, { lastSeen: new Date() })

  io.emit('onlineUsers', Array.from(onlineUsers))
  socket.join(`user:${userId}`)

  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId)
  })

  socket.on('sendMessage', async ({ conversationId, text, imageUrl }) => {
    const convo = await Conversation.findById(conversationId).populate('participants')
    const message = await Message.create({
      conversationId,
      sender: userId,
      text,
      imageUrl,
      deliveredTo: convo.participants.filter(p => p._id.toString() !== userId).map(p => p._id)
    })
    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id, updatedAt: new Date() })
    const populated = await Message.findById(message._id).populate('sender', 'name')
    io.to(conversationId).emit('newMessage', populated)
  })

  socket.on('typing', ({ conversationId }) => {
    socket.to(conversationId).emit('userTyping', { conversationId, userId })
  })

  socket.on('stopTyping', ({ conversationId }) => {
    socket.to(conversationId).emit('userStoppedTyping', { conversationId, userId })
  })

  socket.on('markAsRead', async ({ conversationId }) => {
    await Message.updateMany(
      { conversationId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    )
    io.to(conversationId).emit('messagesRead', { conversationId, userId })
  })

  socket.on('disconnect', async () => {
    onlineUsers.delete(userId)
    io.emit('onlineUsers', Array.from(onlineUsers))
    await User.findByIdAndUpdate(userId, { lastSeen: new Date() })
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server on ${PORT}`))
