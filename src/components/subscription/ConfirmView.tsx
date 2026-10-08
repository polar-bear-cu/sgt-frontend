import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function ConfirmView({
  icon,
  iconClass,
  title,
  children,
  confirmLabel,
  confirmVariant,
  pending,
  failed,
  onBack,
  onConfirm,
}: {
  icon: ReactNode;
  iconClass: string;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  confirmVariant: "default" | "secondary" | "destructive";
  pending?: boolean;
  failed?: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="text-center">
      <div
        className={`mx-auto mb-3.5 flex size-12 items-center justify-center rounded-full ${iconClass}`}
      >
        {icon}
      </div>
      <h3 className="mb-2.5 font-display text-[21px] font-semibold">{title}</h3>
      <p className="mb-5 text-[13px] leading-normal text-muted-foreground">{children}</p>
      {failed && (
        <p role="alert" className="mb-3 text-xs text-danger">
          Something went wrong. Try again.
        </p>
      )}
      <div className="flex gap-2.5 md:justify-center">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1 md:w-[170px] md:flex-none"
          onClick={onBack}
          disabled={pending}
        >
          Go back
        </Button>
        <Button
          type="button"
          variant={confirmVariant}
          size="lg"
          className="flex-1 md:w-[170px] md:flex-none"
          onClick={onConfirm}
          disabled={pending}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
