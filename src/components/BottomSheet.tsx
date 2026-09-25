import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "cn";
import { Dialog } from "radix-ui";

const SIZES = {
  default: "md:top-[20vh] md:left-[calc(50%-14rem)] md:w-md",
  confirm: "md:top-[20vh] md:left-[calc(50%-210px)] md:w-[420px]",
  detail: "md:top-[8vh] md:left-[calc(50%-240px)] md:max-h-[84dvh] md:w-[480px]",
  form: "md:top-[6vh] md:left-[calc(50%-280px)] md:max-h-[88dvh] md:w-[560px]",
};

export function BottomSheet({
  open,
  onOpenChange,
  title,
  label,
  size = "default",
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  label?: string;
  size?: keyof typeof SIZES;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-sheet bg-background px-5 pt-2.5 pb-6 shadow-[0_-20px_40px_-20px_rgb(0_0_0/0.35)] outline-none duration-300 ease-sheet data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-bottom-8 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-8 md:inset-x-auto md:bottom-auto md:rounded-sheet",
            SIZES[size],
          )}
        >
          <div className="mx-auto mt-1.5 mb-3.5 h-1 w-10 rounded-full bg-border md:hidden" />
          {title ? (
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="font-display text-[21px] font-semibold">
                {title}
              </Dialog.Title>
              <Dialog.Close
                tabIndex={-1}
                aria-label="Close"
                className="flex size-[30px] cursor-pointer items-center justify-center rounded-full bg-border text-foreground"
              >
                <X className="size-3.5" />
              </Dialog.Close>
            </div>
          ) : (
            <Dialog.Title className="sr-only">{label}</Dialog.Title>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const SheetTitle = Dialog.Title;
