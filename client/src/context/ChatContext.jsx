import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'
import { useSocket } from './SocketContext'

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const { user } = useAuth()
  const { socket, onlineUsers } = useSocket()
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [typingUsers, setTypingUsers] = useState({})

  useEffect(() => { if (user) fetchConversations() }, [user])

  const fetchConversations = async () => {
    const res = await api.get('/chat/conversations')
    setConversations(res.data)
  }

  const fetchMessages = async (id) => {
    setLoading(true)
    const res = await api.get(`/chat/conversations/${id}/messages`)
    setMessages(res.data)
    setLoading(false)
  }

  useEffect(() => {
    if (!socket) return
    socket.on('newMessage', (msg) => {
      setMessages(prev => [...prev, msg])
      setConversations(prev => prev.map(c => c._id === msg.conversationId ? {...c, lastMessage: msg} : c))
    })
    socket.on('userTyping', ({ conversationId, userId }) => {
      setTypingUsers(prev => ({...prev, [conversationId]: [...(prev[conversationId]||[]).filter(id=>id!==userId), userId]}))
    })
    socket.on('userStoppedTyping', ({ conversationId, userId }) => {
      setTypingUsers(prev => ({...prev, [conversationId]: (prev[conversationId]||[]).filter(id=>id!==userId)}))
    })
    socket.on('messagesRead', ({ conversationId, userId }) => {
      setMessages(prev => prev.map(m => m.conversationId===conversationId && m.sender._id!==userId ? {...m, readBy:[...(m.readBy||[]), userId]} : m))
    })
    return () => {
      socket.off('newMessage')
      socket.off('userTyping')
      socket.off('userStoppedTyping')
      socket.off('messagesRead')
    }
  }, [socket])

  const selectConversation = (convo) => {
    setActiveConversation(convo)
    fetchMessages(convo._id)
    socket?.emit('joinConversation', convo._id)
  }

  const sendMessage = (text, imageUrl) => {
    if (!activeConversation || !socket) return
    socket.emit('sendMessage', { conversationId: activeConversation._id, text, imageUrl })
  }

  const markAsRead = () => {
    if (activeConversation && socket) socket.emit('markAsRead', { conversationId: activeConversation._id })
  }

  useEffect(() => { if (activeConversation) markAsRead() }, [messages, activeConversation])

  return (
    <ChatContext.Provider value={{ conversations, activeConversation, messages, loading, selectConversation, fetchConversations, sendMessage, typingUsers, onlineUsers }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)
