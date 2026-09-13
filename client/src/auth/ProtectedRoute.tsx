import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "@/store/hooks";

export default function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAppSelector(
    (state) => state.auth,
  );

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
