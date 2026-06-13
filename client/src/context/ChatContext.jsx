import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'
import { useSocket } from './SocketContext'
import { encryptMessage, decryptMessage } from '../utils/encryption'

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const { user } = useAuth()
  const { socket, onlineUsers } = useSocket()
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [typingUsers, setTypingUsers] = useState({})

  useEffect(() => { 
    if (user) fetchConversations() 
  }, [user])

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations')
      setConversations(res.data)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }

  const fetchMessages = async (id) => {
    setLoading(true)
    try {
      const res = await api.get(`/chat/conversations/${id}/messages`)
      // Decrypt messages after fetching
      const decryptedMessages = await Promise.all(
        res.data.map(async (msg) => ({
          ...msg,
          text: msg.text ? await decryptMessage(msg.text).catch(() => msg.text) : msg.text
        }))
      )
      setMessages(decryptedMessages)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!socket) return

    socket.on('newMessage', async (msg) => {
      // Decrypt incoming message
      const decryptedMsg = {
        ...msg,
        text: msg.text ? await decryptMessage(msg.text).catch(() => msg.text) : msg.text
      }
      
      setMessages(prev => [...prev, decryptedMsg])
      setConversations(prev => 
        prev.map(c => 
          c._id === msg.conversationId 
            ? { ...c, lastMessage: decryptedMsg } 
            : c
        )
      )
    })

    socket.on('userTyping', ({ conversationId, userId }) => {
      setTypingUsers(prev => ({
        ...prev, 
        [conversationId]: [...(prev[conversationId] || []).filter(id => id !== userId), userId]
      }))
    })

    socket.on('userStoppedTyping', ({ conversationId, userId }) => {
      setTypingUsers(prev => ({
        ...prev, 
        [conversationId]: (prev[conversationId] || []).filter(id => id !== userId)
      }))
    })

    socket.on('messagesRead', ({ conversationId, userId }) => {
      setMessages(prev => 
        prev.map(m => 
          m.conversationId === conversationId && m.sender._id !== userId 
            ? { ...m, readBy: [...(m.readBy || []), userId] } 
            : m
        )
      )
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

  const sendMessage = async (text, imageUrl) => {
    if (!activeConversation || !socket) return
    
    // Encrypt message before sending
    const encryptedText = text ? await encryptMessage(text) : text
    
    socket.emit('sendMessage', { 
      conversationId: activeConversation._id, 
      text: encryptedText, 
      imageUrl 
    })
  }

  const markAsRead = () => {
    if (activeConversation && socket) {
      socket.emit('markAsRead', { conversationId: activeConversation._id })
    }
  }

  useEffect(() => { 
    if (activeConversation) markAsRead() 
  }, [messages, activeConversation])

  return (
    <ChatContext.Provider value={{ 
      conversations, 
      activeConversation, 
      messages, 
      loading, 
      selectConversation, 
      fetchConversations, 
      sendMessage, 
      typingUsers, 
      onlineUsers 
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)