import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PATHS } from "@/routes/paths";

export default function CallbackPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get("access_token");
    if (!accessToken) return;

    login({
      accessToken,
      tokenType: fragment.get("token_type") ?? "Bearer",
      expiresIn: Number(fragment.get("expires_in") ?? 0),
    });
    navigate(PATHS.DASHBOARD, { replace: true });
  }, [login, navigate]);

  return <p>Signing in...</p>;
}
