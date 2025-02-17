import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../../utils/context/AuthGlobal'

export const ProtectedRoute = ({ redirectPath = '/', role, children }) => {
  const { user } = useAuthContext()
  const redirect = role
    ? !(user && user.roles && user.roles.some((rol) => rol.rol === role))
    : !(user && user.roles)

  if (redirect) {
    return <Navigate to={redirectPath} replace />
  }

  return children || <Outlet />
}
