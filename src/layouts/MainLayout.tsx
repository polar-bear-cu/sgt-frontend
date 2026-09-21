import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/context/AuthContext";
import { PATHS } from "../routes/paths";

const OPEN_PATHS: string[] = [PATHS.LOGIN, PATHS.AUTH_CALLBACK, PATHS.STATUS];

export default function MainLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { pathname } = useLocation();

  if (OPEN_PATHS.includes(pathname)) return <>{children}</>;
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to={PATHS.LOGIN} replace />;

  return (
    <div className="min-h-dvh md:pr-24">
      <main className="mx-auto w-full max-w-xl px-5 pt-6 pb-32 md:max-w-2xl md:px-8 md:pb-10">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
