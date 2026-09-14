import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { PATHS } from "@/routes/paths";

export default function CallbackPage() {
  const { login } = useAuth();

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get("access_token");
    if (!accessToken) return;

    login({
      accessToken,
      tokenType: fragment.get("token_type") ?? "Bearer",
      expiresIn: Number(fragment.get("expires_in") ?? 0),
    });
    window.location.href = PATHS.DASHBOARD;
  }, [login]);

  return <p>Signing in...</p>;
}
