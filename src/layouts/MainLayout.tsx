import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PATHS } from "../routes/paths";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div>
      <nav className="flex gap-3 p-2 border-b items-center">
        <Link to={PATHS.DASHBOARD}>Dashboard</Link>
        <Link to={PATHS.SUBSCRIPTIONS}>Subscriptions</Link>
        <Link to={PATHS.PROFILE}>Profile</Link>
        <Link to={PATHS.STATUS}>Status</Link>
        {isAuthenticated ? (
          <button onClick={logout} className="ml-auto">
            Logout
          </button>
        ) : (
          <Link to={PATHS.LOGIN} className="ml-auto">
            Login
          </Link>
        )}
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
