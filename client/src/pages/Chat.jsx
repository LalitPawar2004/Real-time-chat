import { useState, useEffect } from 'react'
import Sidebar from '../components/chat/Sidebar'
import ChatWindow from '../components/chat/ChatWindow'
import { useChat } from '../context/ChatContext'

export default function Chat() {
  const [showSidebar, setShowSidebar] = useState(true)
  const { activeConversation } = useChat()
  const isMobile = window.innerWidth < 768

  useEffect(() => {
    if (isMobile && activeConversation) {
      setShowSidebar(false)
    }
  }, [activeConversation])

  return (
    <div className="d-flex vh-100 position-relative">
      {/* Sidebar - hidden on mobile when chat is active */}
      <div 
        className={`${showSidebar ? 'd-flex' : 'd-none'} d-md-flex h-100`}
        style={{ 
          width: isMobile ? '100%' : '320px',
          minWidth: isMobile ? '100%' : '320px',
          position: isMobile ? 'absolute' : 'relative',
          zIndex: isMobile ? 1000 : 1
        }}
      >
        <Sidebar onHide={() => setShowSidebar(false)} />
      </div>

      {/* Chat Window */}
      <div 
        className={`${!showSidebar ? 'd-flex' : 'd-none d-md-flex'} h-100 flex-grow-1`}
        style={{ minWidth: 0 }}
      >
        <ChatWindow onBack={() => setShowSidebar(true)} />
      </div>
    </div>
  )
}