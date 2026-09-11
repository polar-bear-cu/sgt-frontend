import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PATHS } from "@/routes/paths";

export default function CallbackPage() {
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) return;

    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get("access_token");
    const refreshToken = fragment.get("refresh_token");
    if (!accessToken || !refreshToken) return;

    login({
      accessToken,
      refreshToken,
      tokenType: fragment.get("token_type") ?? "Bearer",
      expiresIn: Number(fragment.get("expires_in") ?? 0),
    });
  }, [isAuthenticated, login]);

  if (isAuthenticated) return <Navigate to={PATHS.DASHBOARD} replace />;
  return <p>Signing in...</p>;
}
