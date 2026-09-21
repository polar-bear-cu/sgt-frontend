import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { cn } from "cn";
import googleLogin from "@/assets/google-login.png";
import logo from "@/assets/logo.png";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { AuthSheet } from "@/components/auth/AuthSheet";
import { SigningIn } from "@/components/auth/SigningIn";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { PATHS } from "@/routes/paths";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [params] = useSearchParams();
  const failed = params.has("error");
  const [showSheet, setShowSheet] = useState(failed);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    function reset(event: PageTransitionEvent) {
      if (event.persisted) setSigningIn(false);
    }
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  function signInWithGoogle() {
    setSigningIn(true);
    window.location.href = "/api/v1/auth/google/login";
  }

  if (isAuthenticated) return <Navigate to={PATHS.DASHBOARD} replace />;
  if (isLoading) return <AuthScreen />;
  if (signingIn) return <SigningIn />;

  if (!showSheet) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-between bg-maroon px-6 pt-15 pb-10 md:justify-center md:gap-16">
        <div className="md:hidden" />
        <img src={logo} alt="Sub Glu Tee" className="w-50 md:w-60" />
        <Button variant="secondary" size="lg" onClick={() => setShowSheet(true)}>
          Get Started
        </Button>
      </div>
    );
  }

  return (
    <AuthScreen>
      <AuthSheet>
        <p className={cn("mb-4 text-[13px]", failed ? "text-danger" : "text-muted-foreground")}>
          {failed ? "Sign-in failed, try again" : "Login with your Google Accounts"}
        </p>
        <button
          type="button"
          onClick={signInWithGoogle}
          className="mx-auto block cursor-pointer rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <img src={googleLogin} alt="Sign in with Google" className="h-10 w-auto" />
        </button>
        <p className="mt-4 text-[11px] text-muted-foreground">
          By signing in, you agree to our
          <br />
          <a href="#" className="underline">
            Privacy policy
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Terms &amp; Conditions
          </a>
        </p>
      </AuthSheet>
    </AuthScreen>
  );
}
