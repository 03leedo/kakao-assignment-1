const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function createDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function createDateFromKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isValidDateKey(dateKey: string): boolean {
  if (!DATE_KEY_PATTERN.test(dateKey)) {
    return false;
  }

  return createDateKey(createDateFromKey(dateKey)) === dateKey;
}

export function getTodayDateKey(): string {
  return createDateKey(new Date());
}

export function addDaysToDateKey(dateKey: string, dayAmount: number): string {
  const date = createDateFromKey(dateKey);
  date.setDate(date.getDate() + dayAmount);

  return createDateKey(date);
}

export function getMondayDateKey(dateKey: string): string {
  const date = createDateFromKey(dateKey);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + diff);

  return createDateKey(date);
}

export function getWeekDateKeys(weekStartDate: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDaysToDateKey(weekStartDate, index));
}

export function formatFullDateLabel(dateKey: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(createDateFromKey(dateKey));
}

export function formatShortDateLabel(dateKey: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).format(createDateFromKey(dateKey));
}

export function formatWeekRangeLabel(weekStartDate: string): string {
  const weekEndDate = addDaysToDateKey(weekStartDate, 6);

  return `${formatShortDateLabel(weekStartDate)} - ${formatShortDateLabel(weekEndDate)}`;
}
