import { AuthScreen } from "@/components/auth/AuthScreen";
import { useAuth } from "@/context/AuthContext";
import { PATHS } from "@/routes/paths";
import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function RouteGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <AuthScreen />;
  if (!isAuthenticated) return <Navigate to={PATHS.LOGIN} replace />;
  return <>{children}</>;
}
