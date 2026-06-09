import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function AuthGuard({ children, allowedRoles, guestOnly = false }) {
  const location = useLocation()
  const { user, isAuthenticated, getRoleHomePath } = useAuth()

  if (guestOnly && isAuthenticated) {
    return <Navigate to={getRoleHomePath(user)} replace />
  }

  if (!guestOnly && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getRoleHomePath(user)} replace />
  }

  return children
}

export default AuthGuard
