import { Bell, ChartNoAxesColumn, House, Plus, User } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "cn";
import { PATHS } from "@/routes/paths";

const itemClass =
  "flex size-10 items-center justify-center rounded-full border-[1.5px] border-white/55 text-white transition active:scale-90";

function navClass({ isActive }: { isActive: boolean }) {
  return cn(itemClass, isActive && "border-white ring-[3px] ring-gold");
}

export default function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-3.5 bottom-[max(0.875rem,env(safe-area-inset-bottom))] z-10 mx-auto flex max-w-md items-center justify-around rounded-full bg-maroon px-2.5 py-3 shadow-raised md:inset-x-auto md:top-1/2 md:bottom-auto md:right-6 md:mx-0 md:-translate-y-1/2 md:flex-col md:gap-4 md:px-3 md:py-4"
    >
      <NavLink to={PATHS.HOME} aria-label="Home" className={navClass}>
        <House className="size-[18px]" />
      </NavLink>
      <NavLink to={PATHS.REPORT} aria-label="Report" className={navClass}>
        <ChartNoAxesColumn className="size-[18px]" />
      </NavLink>
      <Link
        to={`${PATHS.HOME}?add=1`}
        aria-label="Add subscription"
        className="mx-1 -mt-7.5 flex size-14 items-center justify-center rounded-full border-[2.5px] border-maroon bg-cream text-maroon shadow-raised transition active:scale-90 md:mx-0 md:mt-0"
      >
        <Plus className="size-[22px]" />
      </Link>
      <NavLink to={PATHS.NOTIFICATIONS} aria-label="Notifications" className={navClass}>
        <Bell className="size-[18px]" />
      </NavLink>
      <NavLink to={PATHS.PROFILE} aria-label="Profile" className={navClass}>
        <User className="size-[18px]" />
      </NavLink>
    </nav>
  );
}
