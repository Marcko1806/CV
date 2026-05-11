import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function RoleRoute({ requiredRole }) {
  const { currentUser } = useAuth()
  if (currentUser?.role !== requiredRole) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
