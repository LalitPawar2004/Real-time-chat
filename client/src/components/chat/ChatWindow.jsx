import { useState, useRef } from 'react'
import { useChat } from '../../context/ChatContext'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import api from '../../api/axios'

export default function ChatWindow({ onBack }) {
  const { activeConversation, messages, sendMessage, typingUsers } = useChat()
  const { user } = useAuth()
  const { socket } = useSocket()
  const [text, setText] = useState('')
  const fileInputRef = useRef()
  const typingTimeout = useRef()
  const messagesEndRef = useRef()

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!activeConversation) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 bg-light">
        <div className="text-center text-muted p-4">
          <div className="display-1 mb-3">💬</div>
          <h5>Welcome to SecureChat</h5>
          <p>Select a conversation or start a new one</p>
        </div>
      </div>
    )
  }

  const getName = () => {
    if (activeConversation.isGroup) return activeConversation.name
    const other = activeConversation.participants.find(p => p._id !== user._id)
    return other?.name
  }

  const handleChange = (e) => {
    setText(e.target.value)
    if (!socket) return
    socket.emit('typing', { conversationId: activeConversation._id })
    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      socket.emit('stopTyping', { conversationId: activeConversation._id })
    }, 1000)
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    sendMessage(text)
    setText('')
    socket.emit('stopTyping', { conversationId: activeConversation._id })
    scrollToBottom()
  }

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    const res = await api.post('/chat/upload', formData)
    sendMessage('', res.data.url)
  }

  const getStatus = (msg) => {
    const isMe = msg.sender._id === user._id
    if (!isMe) return null
    if (msg.readBy?.length > 0) return <span style={{ color: '#53bdeb' }}>✓✓</span>
    if (msg.deliveredTo?.length > 0) return '✓✓'
    return '✓'
  }

  const typing = typingUsers[activeConversation._id] || []
  const showTyping = typing.length > 0

  return (
    <div className="d-flex flex-column h-100 bg-light">
      {/* Header */}
      <div className="p-3 border-bottom bg-white shadow-sm">
        <div className="d-flex align-items-center">
          {onBack && (
            <button 
              className="btn btn-link text-dark p-0 me-2 d-md-none"
              onClick={onBack}
            >
              ←
            </button>
          )}
          <div className="d-flex align-items-center flex-grow-1">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
              style={{ width: 40, height: 40, fontSize: '16px' }}
            >
              {getName()
                ?.split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="fw-semibold">{getName()}</div>
              <small className="text-success">🔒 Encrypted</small>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-grow-1 overflow-auto p-3"
        style={{ 
          background: '#e5ddd5',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}
      >
        {messages.map(msg => {
          const isMe = msg.sender._id === user._id
          return (
            <div 
              key={msg._id} 
              className={`d-flex mb-2 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div 
                className="rounded-3 p-2 px-3 shadow-sm"
                style={{ 
                  maxWidth: '75%',
                  background: isMe ? '#d9fdd3' : 'white',
                  wordBreak: 'break-word'
                }}
              >
                {!isMe && activeConversation.isGroup && (
                  <small className="fw-semibold text-primary d-block mb-1">
                    {msg.sender.name}
                  </small>
                )}
                {msg.imageUrl && (
                  <img 
                    src={msg.imageUrl} 
                    alt="Shared" 
                    className="img-fluid rounded mb-1" 
                    style={{ maxWidth: 250, cursor: 'pointer' }}
                    loading="lazy"
                  />
                )}
                {msg.text && <div>{msg.text}</div>}
                <div className="d-flex justify-content-end align-items-center gap-1 mt-1">
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </small>
                  {getStatus(msg)}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {showTyping && (
        <div className="px-3 py-1 bg-white border-top">
          <small className="text-primary fst-italic">typing...</small>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 bg-white border-top">
        <div className="input-group">
          <button 
            type="button" 
            className="btn btn-outline-secondary"
            onClick={() => fileInputRef.current.click()}
            title="Send Image"
          >
            📎
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            hidden 
            accept="image/*" 
            onChange={handleFile} 
          />
          <input 
            className="form-control" 
            placeholder="Type a message..." 
            value={text} 
            onChange={handleChange}
            autoFocus
          />
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={!text.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}