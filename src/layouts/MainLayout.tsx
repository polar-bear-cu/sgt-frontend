import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/context/AuthContext";
import { PUBLIC_PATHS } from "../routes/paths";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  if (!isAuthenticated || PUBLIC_PATHS.includes(pathname)) return <>{children}</>;

  return (
    <div className="min-h-dvh md:pr-24">
      <main className="mx-auto w-full max-w-xl px-5 pt-6 pb-32 md:max-w-2xl md:px-8 md:pb-10">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
