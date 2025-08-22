import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function Protected({ children }: { children: ReactNode }) {
  const { accessToken, user } = useAuthStore();
  const location = useLocation();

  if (!accessToken || !user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
