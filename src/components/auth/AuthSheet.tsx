import type { ReactNode } from "react";

export function AuthSheet({ children }: { children: ReactNode }) {
  return (
    <div className="w-full animate-in rounded-t-sheet bg-background px-6 pt-6.5 pb-7.5 text-center duration-300 ease-sheet fade-in slide-in-from-bottom-8 md:max-w-sm md:rounded-sheet">
      {children}
    </div>
  );
}
