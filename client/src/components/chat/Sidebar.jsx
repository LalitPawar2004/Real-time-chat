import { useState } from 'react'
import { useChat } from '../../context/ChatContext'
import { useAuth } from '../../context/AuthContext'
import NewChatModal from './NewChatModal'
import { useNavigate } from 'react-router-dom'

export default function Sidebar({ onHide }) {
  const { conversations, activeConversation, selectConversation, onlineUsers } = useChat()
  const { user, logout } = useAuth()
  const [showNew, setShowNew] = useState(false)
  const navigate = useNavigate()

  const getName = (convo) => {
    if (convo.isGroup) return convo.name
    const other = convo.participants.find(p => p._id !== user._id)
    return other?.name || 'Unknown'
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSelect = (convo) => {
    selectConversation(convo)
    if (window.innerWidth < 768 && onHide) onHide()
  }

  return (
    <div className="d-flex flex-column h-100 bg-white border-end w-100">
      <div className="p-3 border-bottom">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">💬 Chats</h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-primary rounded-circle"
              onClick={() => setShowNew(true)}
              title="New Chat"
            >
              +
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleLogout}
              title="Logout"
            >
              🚪
            </button>
            {/* Close button for mobile */}
            {onHide && (
              <button 
                className="btn btn-sm btn-outline-secondary d-md-none"
                onClick={onHide}
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <small className="text-muted">
          👤 {user?.name}
        </small>
      </div>

      <div className="flex-grow-1 overflow-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {conversations.map(convo => {
          const otherId = convo.isGroup
            ? null
            : convo.participants.find(p => p._id !== user._id)?._id
          const isOnline = otherId && onlineUsers.includes(otherId)

          return (
            <div
              key={convo._id}
              onClick={() => handleSelect(convo)}
              className={`d-flex align-items-center p-3 border-bottom cursor-pointer ${
                activeConversation?._id === convo._id ? 'bg-primary bg-opacity-10' : ''
              }`}
              style={{ cursor: 'pointer' }}
              role="button"
            >
              <div className="position-relative me-3 flex-shrink-0">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{ width: 48, height: 48, fontSize: '18px' }}
                >
                  {getName(convo)
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                {isOnline && (
                  <span
                    className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white"
                    style={{ width: 12, height: 12 }}
                  />
                )}
              </div>

              <div className="flex-grow-1 overflow-hidden min-w-0">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-semibold text-truncate">{getName(convo)}</span>
                </div>
                <small className="text-muted text-truncate d-block">
                  {convo.lastMessage?.text
                    ? convo.lastMessage.text.substring(0, 30)
                    : convo.lastMessage?.imageUrl
                    ? '📷 Photo'
                    : 'No messages yet'}
                </small>
              </div>
            </div>
          )
        })}

        {conversations.length === 0 && (
          <div className="p-5 text-center text-muted">
            <div className="display-6 mb-3">💬</div>
            <p>No conversations yet</p>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setShowNew(true)}
            >
              Start New Chat
            </button>
          </div>
        )}
      </div>

      {showNew && <NewChatModal onClose={() => setShowNew(false)} />}
    </div>
  )
}