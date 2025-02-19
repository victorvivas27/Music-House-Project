import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../../utils/context/AuthGlobal'
import PropTypes from 'prop-types';

export const ProtectedRoute = ({ redirectPath = '/', role, children }) => {
  const { isUserAdmin, isUser } = useAuthContext();

  const hasAccess = 
    (role === "ADMIN" && isUserAdmin) || 
    (role === "USER" && isUser) || 
    (!role); // Si no se requiere un rol específico, permitir acceso

  if (!hasAccess) {
    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
};
ProtectedRoute.propTypes={
  redirectPath: PropTypes.string,
  role: PropTypes.string,
  children: PropTypes.node,
}