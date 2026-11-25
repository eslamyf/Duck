import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { getCurrentUser } from '../../entities/user/api/authService.js';
import { STAFF_PORTAL_PATHS } from '../../entities/user/model/roles.js';
import { ROUTES } from '../../shared/config/routes.js';

function ProtectedRoute({
  allowedRoles = [],
  children,
}) {
  const location = useLocation();
  const user = getCurrentUser();

  // Redirect unauthenticated users to Login
  if (!user?.id) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  // Redirect authenticated users whose role is not permitted
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const redirectPath =
      STAFF_PORTAL_PATHS[user.role] || ROUTES.HOME || '/';

    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
}

export default ProtectedRoute;