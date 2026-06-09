import { useState } from 'react'
import api from '../../api/axios'
import { useChat } from '../../context/ChatContext'

export default function NewChatModal({ onClose }) {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState([])
  const [groupName, setGroupName] = useState('')
  const { fetchConversations, selectConversation } = useChat()

  const handleSearch = async (e) => {
    const q = e.target.value
    setSearch(q)
    if (q.length < 2) return
    const res = await api.get(`/users?search=${q}`)
    setUsers(res.data)
  }

  const toggleUser = (user) => {
    setSelected(prev => prev.find(u => u._id === user._id) ? prev.filter(u => u._id !== user._id) : [...prev, user])
  }

  const createChat = async () => {
    if (selected.length === 0) return
    const payload = selected.length === 1
      ? { userId: selected[0]._id }
      : { isGroup: true, name: groupName || selected.map(u => u.name).join(', '), participants: selected.map(u => u._id) }
    const res = await api.post('/chat/conversations', payload)
    await fetchConversations()
    selectConversation(res.data)
    onClose()
  }

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">New Chat</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input className="form-control mb-2" placeholder="Search users" value={search} onChange={handleSearch} />
            {selected.length > 1 && (
              <input className="form-control mb-2" placeholder="Group name" value={groupName} onChange={e => setGroupName(e.target.value)} />
            )}
            <div style={{ maxHeight: 200, overflow: 'auto' }}>
              {users.map(u => (
                <div key={u._id} className="d-flex align-items-center p-2 border-bottom" onClick={() => toggleUser(u)} style={{ cursor: 'pointer' }}>
                  <input type="checkbox" className="me-2" checked={!!selected.find(s => s._id === u._id)} readOnly />
                  <div>
                    <div>{u.name}</div>
                    <small className="text-muted">{u.email}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={createChat} disabled={selected.length === 0}>
              {selected.length > 1 ? 'Create Group' : 'Start Chat'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
