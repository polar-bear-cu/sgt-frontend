import { AuthScreen } from "./AuthScreen";
import { AuthSheet } from "./AuthSheet";

export function SigningIn() {
  return (
    <AuthScreen>
      <AuthSheet>
        <p className="mb-4 text-[13px] text-muted-foreground">Signing you in&hellip;</p>
        <div
          role="status"
          aria-label="Signing you in"
          className="mx-auto mt-2 mb-1 size-7 animate-spin rounded-full border-3 border-border border-t-primary"
        />
      </AuthSheet>
    </AuthScreen>
  );
}
