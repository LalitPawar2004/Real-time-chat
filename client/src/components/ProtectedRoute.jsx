import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center">Loading...</div>
  return user ? children : <Navigate to="/login" />
}
