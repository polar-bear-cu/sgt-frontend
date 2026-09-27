import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SigningIn } from "@/components/auth/SigningIn";
import { useAuth } from "@/context/AuthContext";
import { PATHS } from "@/routes/paths";

export default function CallbackPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get("access_token");
    if (!accessToken) {
      navigate(`${PATHS.LOGIN}?error=missing_token`, { replace: true });
      return;
    }

    login({
      accessToken,
      tokenType: fragment.get("token_type") ?? "Bearer",
      expiresIn: Number(fragment.get("expires_in") ?? 0),
    });
    navigate(PATHS.HOME, { replace: true });
  }, [login, navigate]);

  return <SigningIn />;
}
