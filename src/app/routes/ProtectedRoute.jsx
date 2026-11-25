import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { getCurrentUser } from '../../entities/user/api/authService.js';
import { ROLES, STAFF_PORTAL_PATHS } from '../../entities/user/model/roles.js';
import { ROUTES } from '../../shared/config/routes.js';

function ProtectedRoute({
  allowedRoles = [],
  children,
}) {
  const location = useLocation();
  const user = getCurrentUser();

  // لو المستخدم مش مسجل دخول
  if (!user) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  // لو المستخدم مسجل لكن دوره مش مسموح له
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const redirectPath =
      STAFF_PORTAL_PATHS[user.role] || ROUTES.HOME || '/';

    return <Navigate to={redirectPath} replace />;
  }

  // عرض الصفحة المحمية
  return children || <Outlet />;
}

export default ProtectedRoute;