import { useState } from 'react'
import { useChat } from '../../context/ChatContext'
import { useAuth } from '../../context/AuthContext'
import NewChatModal from './NewChatModal'

export default function Sidebar() {
  const { conversations, activeConversation, selectConversation, onlineUsers } = useChat()
  const { user, logout } = useAuth()
  const [showNew, setShowNew] = useState(false)

  const getName = (convo) => {
    if (convo.isGroup) return convo.name
    const other = convo.participants.find(p => p._id !== user._id)
    return other?.name || 'Unknown'
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="d-flex flex-column h-100 bg-white border-end" style={{ width: '320px' }}>
      <div className="p-3 border-bottom">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Chats</h5>

          <div>
            <button
              className="btn btn-sm btn-primary me-2"
              onClick={() => setShowNew(true)}
            >
              +
            </button>

            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <small className="text-muted">
          Logged in as {user?.name}
        </small>
      </div>

      <div className="flex-grow-1 overflow-auto">
        {conversations.map(convo => {
          const otherId = convo.isGroup
            ? null
            : convo.participants.find(p => p._id !== user._id)?._id

          const isOnline = otherId && onlineUsers.includes(otherId)

          return (
            <div
              key={convo._id}
              onClick={() => selectConversation(convo)}
              className={`d-flex align-items-center p-3 border-bottom ${
                activeConversation?._id === convo._id ? 'bg-light' : ''
              }`}
              style={{ cursor: 'pointer' }}
            >
              <div className="position-relative me-3">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{ width: 48, height: 48 }}
                >
                  {getName(convo)
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>

                {isOnline && (
                  <span
                    className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white"
                    style={{ width: 12, height: 12 }}
                  ></span>
                )}
              </div>

              <div className="flex-grow-1 overflow-hidden">
                <div className="fw-semibold text-truncate">
                  {getName(convo)}
                </div>

                <small className="text-muted text-truncate">
                  {convo.lastMessage?.text ||
                    (convo.lastMessage?.imageUrl
                      ? 'Photo'
                      : 'No messages yet')}
                </small>
              </div>
            </div>
          )
        })}

        {conversations.length === 0 && (
          <div className="p-4 text-center text-muted">
            No conversations yet
          </div>
        )}
      </div>

      {showNew && (
        <NewChatModal onClose={() => setShowNew(false)} />
      )}
    </div>
  )
}