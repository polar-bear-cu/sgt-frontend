import { useQuery } from "@tanstack/react-query";
import { Bell, ChartNoAxesColumn, House, Plus, User } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "cn";
import { getUnreadCount } from "@/api/notifications";
import { PATHS } from "@/routes/paths";

const itemClass =
  "relative flex size-10 items-center justify-center rounded-full border-[1.5px] border-white/55 text-white transition-colors";

function NavItem({
  to,
  label,
  previous,
  children,
}: {
  to: string;
  label: string;
  previous: string;
  children: ReactNode;
}) {
  return (
    <NavLink
      to={to}
      aria-label={label}
      className={({ isActive }) => cn(itemClass, isActive && "border-white")}
    >
      {({ isActive }) => (
        <>
          {children}
          {isActive && <span aria-hidden="true" className="nav-ring nav-ring-in" />}
          {!isActive && to === previous && (
            <span aria-hidden="true" className="nav-ring nav-ring-out" />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function BottomNav() {
  const unread = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    refetchInterval: 60_000,
  });
  const { pathname } = useLocation();
  const [route, setRoute] = useState({ current: pathname, previous: "" });
  if (route.current !== pathname) setRoute({ current: pathname, previous: route.current });
  const hasUnread = (unread.data?.unread_count ?? 0) > 0;

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-3.5 bottom-[max(0.875rem,env(safe-area-inset-bottom))] z-10 mx-auto flex max-w-md items-center justify-around rounded-full bg-maroon px-2.5 py-3 shadow-raised md:inset-x-auto md:top-1/2 md:bottom-auto md:right-6 md:mx-0 md:-translate-y-1/2 md:flex-col md:gap-4 md:px-3 md:py-4"
    >
      <NavItem to={PATHS.HOME} label="Home" previous={route.previous}>
        <House className="size-[18px]" />
      </NavItem>
      <NavItem to={PATHS.REPORT} label="Report" previous={route.previous}>
        <ChartNoAxesColumn className="size-[18px]" />
      </NavItem>
      <Link
        to={`${PATHS.HOME}?add=1`}
        aria-label="Add subscription"
        className="mx-3 -mt-7.5 flex size-14 items-center justify-center rounded-full border-[2.5px] border-maroon bg-cream text-maroon shadow-raised transition active:scale-90 md:mx-0 md:mt-0"
      >
        <Plus className="size-[22px]" />
      </Link>
      <NavItem
        to={PATHS.NOTIFICATIONS}
        label={hasUnread ? "Notifications, unread" : "Notifications"}
        previous={route.previous}
      >
        <Bell className="size-[18px]" />
        {hasUnread && (
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-gold ring-2 ring-maroon"
          />
        )}
      </NavItem>
      <NavItem to={PATHS.PROFILE} label="Profile" previous={route.previous}>
        <User className="size-[18px]" />
      </NavItem>
    </nav>
  );
}
