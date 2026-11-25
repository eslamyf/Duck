import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { getCurrentUser } from '../../entities/user/api/authService.js';
import { can } from '../../entities/user/model/roles.js';
import { getPortalPathForRole } from '../../shared/config/rbac.js';
import { ROUTES } from '../../shared/config/routes.js';

function ProtectedRoute({
  allowedRoles = [],
  requiredPermission,
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

  const roleAllowed =
    allowedRoles.length === 0 || allowedRoles.includes(user.role);
  const permissionAllowed =
    !requiredPermission ||
    can(user.role, requiredPermission, user.permissions);

  // Redirect authenticated users whose role or permission is not permitted
  if (!roleAllowed || !permissionAllowed) {
    const redirectPath = getPortalPathForRole(user.role) || ROUTES.HOME || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
}

export default ProtectedRoute;