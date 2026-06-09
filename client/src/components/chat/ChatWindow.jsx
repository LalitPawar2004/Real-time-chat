import { useState, useRef } from 'react'
import { useChat } from '../../context/ChatContext'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import api from '../../api/axios'

export default function ChatWindow() {
  const { activeConversation, messages, sendMessage, typingUsers } = useChat()
  const { user } = useAuth()
  const { socket } = useSocket()
  const [text, setText] = useState('')
  const fileInputRef = useRef()
  const typingTimeout = useRef()

  if (!activeConversation) {
    return <div className="d-flex align-items-center justify-content-center h-100 bg-light"><p className="text-muted">Select a conversation</p></div>
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
    typingTimeout.current = setTimeout(() => socket.emit('stopTyping', { conversationId: activeConversation._id }), 1000)
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    sendMessage(text)
    setText('')
    socket.emit('stopTyping', { conversationId: activeConversation._id })
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
    if (msg.readBy?.length > 0) return <span style={{color:'#53bdeb'}}>✓✓</span>
    if (msg.deliveredTo?.length > 0) return '✓✓'
    return '✓'
  }

  const typing = typingUsers[activeConversation._id] || []
  const showTyping = typing.length > 0

  return (
    <div className="d-flex flex-column h-100">
      <div className="p-3 border-bottom bg-white"><div className="fw-semibold">{getName()}</div></div>
      <div className="flex-grow-1 overflow-auto p-3" style={{ background: '#e5ddd5' }}>
        {messages.map(msg => {
          const isMe = msg.sender._id === user._id
          return (
            <div key={msg._id} className={`d-flex mb-2 ${isMe ? 'justify-content-end' : ''}`}>
              <div className="rounded-3 p-2 shadow-sm" style={{ maxWidth: '65%', background: isMe ? '#d9fdd3' : 'white' }}>
                {!isMe && activeConversation.isGroup && <small className="fw-semibold d-block">{msg.sender.name}</small>}
                {msg.imageUrl && <img src={msg.imageUrl} alt="" className="img-fluid rounded mb-1" style={{maxWidth: 200}} />}
                {msg.text && <div>{msg.text}</div>}
                <div className="text-end"><small className="text-muted">{new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} {getStatus(msg)}</small></div>
              </div>
            </div>
          )
        })}
      </div>
      {showTyping && <div className="px-3 py-1 bg-white border-top"><small className="text-primary fst-italic">typing...</small></div>}
      <form onSubmit={handleSend} className="p-3 bg-white">
        <div className="input-group">
          <button type="button" className="btn btn-outline-secondary" onClick={() => fileInputRef.current.click()}>📎</button>
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFile} />
          <input className="form-control" placeholder="Type a message" value={text} onChange={handleChange} />
          <button className="btn btn-primary" type="submit">Send</button>
        </div>
      </form>
    </div>
  )
}
