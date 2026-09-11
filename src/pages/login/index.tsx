import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [params] = useSearchParams();
  const error = params.get("error");

  function signInWithGoogle() {
    window.location.href = "/api/v1/auth/google/login";
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <h2 className="text-xl font-bold">Login</h2>
      {error && <p className="text-sm text-red-600">login failed: {error}</p>}
      <Button onClick={signInWithGoogle}>Sign in with Google</Button>
    </div>
  );
}
