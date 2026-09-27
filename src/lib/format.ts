const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY = 24 * 60 * 60 * 1000;

export function shortDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function money(amount: number, twoDecimals = false): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: twoDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function daysUntil(iso: string): number {
  return Math.round((startOfDay(new Date(iso)) - startOfDay(new Date())) / DAY);
}

export function daysSince(iso: string): number {
  return Math.max(0, -daysUntil(iso));
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toDateInput(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromDateInput(value: string): string {
  return new Date(`${value}T00:00:00`).toISOString();
}
