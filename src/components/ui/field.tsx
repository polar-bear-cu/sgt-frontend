import type { ComponentProps, ReactNode } from "react";
import { cn } from "cn";

const controlClass =
  "w-full rounded-[14px] border-[1.5px] border-input bg-card px-3.5 py-3 text-sm text-foreground outline-none transition focus:border-maroon focus:ring-[3px] focus:ring-maroon/12 aria-invalid:border-danger [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlClass, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(controlClass, className)} {...props} />;
}

export function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
