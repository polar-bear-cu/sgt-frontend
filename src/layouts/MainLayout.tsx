import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../routes/paths";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav className="flex gap-3 p-2 border-b">
        <Link to={PATHS.DASHBOARD}>Dashboard</Link>
        <Link to={PATHS.SUBSCRIPTIONS}>Subscriptions</Link>
        <Link to={PATHS.PROFILE}>Profile</Link>
        <Link to={PATHS.LOGIN}>Login</Link>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
