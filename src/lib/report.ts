import { money } from "./format";

const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function parts(key: string): [number, number] {
  const [year, month] = key.split("-").map(Number);
  return [year, month];
}

export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

const MONTH_FORMAT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "2-digit",
});

export function currentMonth(): string {
  return MONTH_FORMAT.format(new Date());
}

export function shiftMonth(key: string, step: number): string {
  const [year, month] = parts(key);
  return monthKey(new Date(year, month - 1 + step, 1));
}

export function countMonths(from: string, to: string): number {
  const [fromYear, fromMonth] = parts(from);
  const [toYear, toMonth] = parts(to);
  return (toYear - fromYear) * 12 + (toMonth - fromMonth) + 1;
}

export function monthShort(key: string): string {
  return SHORT[parts(key)[1] - 1];
}

export function monthLong(key: string): string {
  const [year, month] = parts(key);
  return `${LONG[month - 1]} ${year}`;
}

export function monthRange(from: string, to: string): string {
  return `${monthShort(from)} ${parts(from)[0]} – ${monthShort(to)} ${parts(to)[0]}`;
}

export function baht(value: number): string {
  return `${money(value)}฿`;
}

export function compact(value: number): string {
  if (value < 1000) return String(Math.round(value));
  return `${Math.round(value / 100) / 10}k`;
}

export function titleCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function dayParts(iso: string): { day: string; weekday: string } {
  const date = new Date(`${iso.slice(0, 10)}T00:00:00`);
  return {
    day: iso.slice(8, 10),
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
  };
}
