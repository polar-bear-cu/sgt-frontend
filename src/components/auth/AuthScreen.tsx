import type { ReactNode } from "react";

export function AuthScreen({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col justify-end bg-maroon md:items-center md:justify-center md:p-6">
      {children}
    </div>
  );
}
