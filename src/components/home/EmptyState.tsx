import { ChevronDown, CreditCard } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center py-16 text-center text-sm md:py-24">
      <CreditCard className="mb-3.5 size-11 text-sand" strokeWidth={1.5} />
      <p>No subscriptions yet</p>
      <p className="mt-2 text-[13px] text-ink-muted">
        <span className="md:hidden">Tap + to add your first one</span>
        <span className="hidden md:inline">Click + to add your first one</span>
      </p>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-32 flex justify-center md:inset-x-auto md:top-1/2 md:right-28 md:bottom-auto md:-translate-y-1/2"
      >
        <div className="flex animate-nudge flex-col items-center text-maroon motion-reduce:animate-none md:animate-nudge-x md:flex-row">
          {[0.3, 0.6, 1].map((opacity) => (
            <ChevronDown
              key={opacity}
              style={{ opacity }}
              className="-mt-[7px] size-[22px] first:mt-0 md:mt-0 md:-ml-[9px] md:-rotate-90 md:first:ml-0"
              strokeWidth={2.5}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
