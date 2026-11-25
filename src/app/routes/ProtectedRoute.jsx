import { Navigate, Outlet } from "react-router-dom";

import { getCurrentUser } from "../../entities/user/api/authService.js";

function ProtectedRoute() {
  const currentUser = getCurrentUser();

  // Redirect unauthenticated users to Login
  if (!currentUser?.id) {
    return <Navigate to="/login" replace />;
  }

  // Allow authenticated users to access protected pages
  return <Outlet />;
}

export default ProtectedRoute;