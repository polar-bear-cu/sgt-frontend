import type { ReactNode } from "react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";
import { cn } from "cn";
import { version } from "../../../package.json";
import googleG from "@/assets/google-g.png";
import { DEFAULT_CURRENCY, DEFAULT_TIME_IN_ADVANCED, getMe, type Me } from "@/api/users";
import { DeleteAccountSheet } from "@/components/profile/DeleteAccountSheet";
import { EditProfileSheet, type EditField } from "@/components/profile/EditProfileSheet";
import { Button } from "@/components/ui/button";
import { useAuth, type User } from "@/context/AuthContext";

function Avatar({ name, pictureUrl }: { name: string; pictureUrl: string }) {
  const [broken, setBroken] = useState(false);
  const initial = (name.trim()[0] ?? "?").toUpperCase();

  return (
    <div className="mb-3 flex size-21 items-center justify-center overflow-hidden rounded-full bg-maroon font-display text-3xl font-semibold text-white shadow-[inset_0_1px_2px_rgb(255_255_255/0.3),0_12px_24px_-10px_rgb(122_32_32/0.5)]">
      {pictureUrl && !broken ? (
        <img
          src={pictureUrl}
          alt=""
          referrerPolicy="no-referrer"
          className="size-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        initial
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 mb-2.5 text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  );
}

function Row({
  label,
  icon,
  value,
  href,
  onClick,
}: {
  label: string;
  icon?: ReactNode;
  value?: string;
  href?: string;
  onClick?: () => void;
}) {
  const tappable = Boolean(href || onClick);
  const content = (
    <>
      <span className="flex items-center gap-3 font-semibold">
        {icon}
        {label}
      </span>
      {(value || tappable) && (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          {value}
          {tappable && <ChevronRight className="size-4" />}
        </span>
      )}
    </>
  );
  const className = cn(
    "flex w-full items-center justify-between border-b border-border px-1 py-3.5 text-left text-sm last:border-b-0",
    onClick && "cursor-pointer",
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }
  return href ? (
    <a href={href} className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}

function Header({
  me,
  account,
  onRetry,
  onEditName,
}: {
  me: ReturnType<typeof useMe>;
  account: User | null;
  onRetry: () => void;
  onEditName: () => void;
}) {
  if (me.isError && account) {
    return (
      <div className="flex flex-col items-center pt-3 pb-5 text-center">
        <Avatar name={account.name || account.email} pictureUrl={account.picture ?? ""} />
        <div className="max-w-full truncate font-display text-[21px] font-semibold">
          {account.name || account.email}
        </div>
        <div className="max-w-full truncate text-[13px] text-muted-foreground">{account.email}</div>
        <p className="mt-2 text-xs text-muted-foreground">
          Couldn&apos;t load your latest profile.{" "}
          <button type="button" onClick={onRetry} className="cursor-pointer underline">
            Try again
          </button>
        </p>
      </div>
    );
  }

  if (me.isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <p className="text-sm text-muted-foreground">Couldn&apos;t load your profile.</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  }

  if (!me.data) {
    return (
      <div className="flex animate-pulse flex-col items-center pt-3 pb-5" aria-busy="true">
        <div className="mb-3 size-21 rounded-full bg-muted" />
        <div className="mb-2 h-5 w-36 rounded-full bg-muted" />
        <div className="h-3.5 w-48 rounded-full bg-muted" />
      </div>
    );
  }

  const data: Me = me.data;
  return (
    <div className="flex flex-col items-center pt-3 pb-5 text-center">
      <Avatar name={data.displayName || data.email} pictureUrl={data.pictureUrl} />
      <div className="flex max-w-full items-center gap-2">
        <div className="min-w-0 truncate font-display text-[21px] font-semibold">
          {data.displayName || data.email}
        </div>
        <button
          type="button"
          aria-label="Edit name"
          onClick={onEditName}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-maroon/10 text-maroon"
        >
          <Pencil className="size-[13px]" />
        </button>
      </div>
      <div className="max-w-full truncate text-[13px] text-muted-foreground">{data.email}</div>
    </div>
  );
}

function useMe() {
  return useQuery({ queryKey: ["me"], queryFn: getMe });
}

export default function ProfilePage() {
  const { logout, user } = useAuth();
  const queryClient = useQueryClient();
  const me = useMe();
  const [editField, setEditField] = useState<EditField>("displayName");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const currency = me.data?.currency ?? DEFAULT_CURRENCY;
  const timeInAdvanced = me.data?.timeInAdvanced ?? DEFAULT_TIME_IN_ADVANCED;

  function edit(field: EditField) {
    setEditField(field);
    setSheetOpen(true);
  }

  function signOut() {
    logout();
    queryClient.clear();
  }

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-semibold tracking-tight">Profile</h1>

      <Header
        me={me}
        account={user}
        onRetry={() => void me.refetch()}
        onEditName={() => edit("displayName")}
      />

      <SectionTitle>Account</SectionTitle>
      <Row
        label="Google Account"
        icon={<img src={googleG} alt="" className="size-8" />}
        value="Linked"
      />
      <Row
        label="Currency"
        value={currency === "THB" ? "THB (฿)" : currency}
        onClick={me.data ? () => edit("currency") : undefined}
      />
      <Row
        label="Default reminder"
        value={`${timeInAdvanced} ${timeInAdvanced === 1 ? "day" : "days"}`}
        onClick={me.data ? () => edit("timeInAdvanced") : undefined}
      />

      <SectionTitle>About</SectionTitle>
      <Row label="App version" value={version} />
      <Row label="Privacy Policy" href="#" />
      <Row label="Terms & Conditions" href="#" />

      <Button
        variant="outline"
        size="lg"
        className="mt-6 w-full border-danger bg-transparent text-danger hover:bg-danger/10 hover:text-danger"
        onClick={signOut}
      >
        Sign out
      </Button>

      {me.data && (
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="mx-auto mt-3.5 flex cursor-pointer items-center gap-1.5 py-2 text-sm font-semibold text-danger"
        >
          <Trash2 className="size-[15px]" />
          Delete account
        </button>
      )}

      <DeleteAccountSheet open={deleteOpen} onClose={() => setDeleteOpen(false)} />

      {me.data && (
        <EditProfileSheet
          field={editField}
          open={sheetOpen}
          me={me.data}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
