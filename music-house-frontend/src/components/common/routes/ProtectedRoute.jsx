import { Navigate, Outlet } from 'react-router-dom'

import PropTypes from 'prop-types';
import { useAuth } from '../../../hook/useAuth';
import { ROLE_ADMIN, ROLE_USER } from '../../utils/roles/constants';

export const ProtectedRoute = ({ redirectPath = '/', role, children }) => {
  const { isUserAdmin, isUser } = useAuth();

  const hasAccess = 
    (role === ROLE_ADMIN && isUserAdmin) || 
    (role === ROLE_USER && isUser) || 
    (!role); 

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