import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import { useMe } from "@/hooks/useMe";
import { PATHS } from "@/routes/paths";

export default function AppHeader() {
  const { user } = useAuth();
  const me = useMe();
  const firstName = (user?.name ?? "").trim().split(" ")[0];

  return (
    <header className="-mx-5 -mt-6 flex items-center justify-between bg-maroon px-5 pt-[18px] pb-[26px] mb-5 md:mx-0 md:mt-0 md:mb-6 md:rounded-sheet md:px-7 md:py-[22px]">
      <img src={logo} alt="Sub Glu Tee" className="size-10 object-contain md:size-11" />
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-[#f2e9df] md:text-[15px]">
          {firstName ? `Welcome, ${firstName}` : "Welcome back"}
        </span>
        {me.data?.role === "admin" && (
          <Link
            to={PATHS.ADMIN}
            aria-label="Admin"
            title="Admin"
            className="flex size-9 items-center justify-center rounded-full bg-white/10 text-[#f2e9df] transition-colors hover:bg-white/20"
          >
            <ShieldCheck className="size-[18px]" />
          </Link>
        )}
      </div>
    </header>
  );
}
