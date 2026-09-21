import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Dialog } from "radix-ui";

export function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-maroon/60 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-sheet bg-background px-5 pt-2.5 pb-6 shadow-[0_-20px_40px_-20px_rgb(0_0_0/0.35)] outline-none duration-300 ease-sheet data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-bottom-8 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-8 md:inset-x-auto md:top-[20vh] md:bottom-auto md:left-[calc(50%-14rem)] md:w-md md:rounded-sheet"
        >
          <div className="mx-auto mt-1.5 mb-3.5 h-1 w-10 rounded-full bg-border md:hidden" />
          {title && (
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
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const SheetTitle = Dialog.Title;
