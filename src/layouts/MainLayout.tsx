import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PATHS } from "../routes/paths";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { pathname } = useLocation();

  if (pathname === PATHS.LOGIN || pathname === PATHS.AUTH_CALLBACK) return <>{children}</>;

  return (
    <div>
      <nav className="flex gap-3 p-2 border-b items-center">
        <Link to={PATHS.DASHBOARD}>Dashboard</Link>
        <Link to={PATHS.SUBSCRIPTIONS}>Subscriptions</Link>
        <Link to={PATHS.PROFILE}>Profile</Link>
        <Link to={PATHS.STATUS}>Status</Link>
        {isAuthenticated ? (
          <div className="ml-auto flex items-center gap-2">
            {user?.picture && (
              <img
                src={user.picture}
                alt=""
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full"
              />
            )}
            <span>{user?.name ?? user?.email}</span>
            <button onClick={logout}>Logout</button>
          </div>
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
