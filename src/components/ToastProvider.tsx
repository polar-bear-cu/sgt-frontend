import { useCallback, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { Toast } from "radix-ui";
import { ToastContext } from "@/hooks/useToast";

interface Item {
  id: number;
  message: string;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const counter = useRef(0);

  const show = useCallback((message: string) => {
    counter.current += 1;
    const id = counter.current;
    setItems((list) => [...list, { id, message }]);
  }, []);

  function remove(id: number) {
    setItems((list) => list.filter((item) => item.id !== id));
  }

  return (
    <ToastContext.Provider value={show}>
      <Toast.Provider duration={3000} swipeDirection="down">
        {children}
        {items.map((item) => (
          <Toast.Root
            key={item.id}
            onOpenChange={(open) => !open && remove(item.id)}
            className="flex items-center gap-2.5 rounded-[14px] bg-foreground px-4 py-3 text-[13px] font-semibold text-background shadow-[0_12px_28px_-10px_rgb(43_36_32/0.5)] data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-4"
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-success-text">
              <Check className="size-3" strokeWidth={3} />
            </span>
            <Toast.Description>{item.message}</Toast.Description>
          </Toast.Root>
        ))}
        <Toast.Viewport className="fixed inset-x-0 bottom-28 z-[70] mx-auto flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 outline-none md:bottom-6" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
