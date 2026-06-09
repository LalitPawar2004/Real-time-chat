import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('token')
    const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
    const newSocket = io(url, { auth: { token }, withCredentials: true })
    setSocket(newSocket)
    newSocket.on('onlineUsers', setOnlineUsers)
    return () => newSocket.close()
  }, [user])

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
