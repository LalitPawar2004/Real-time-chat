import Sidebar from '../components/chat/Sidebar'
import ChatWindow from '../components/chat/ChatWindow'

export default function Chat() {
  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="flex-grow-1"><ChatWindow /></div>
    </div>
  )
}
