export function createDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function createDateFromKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function isValidDateKey(dateKey) {
  if (typeof dateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return false;
  }

  const date = createDateFromKey(dateKey);

  return createDateKey(date) === dateKey;
}

export function getTodayDateKey() {
  return createDateKey(new Date());
}

export function addDaysToDateKey(dateKey, dayAmount) {
  const date = createDateFromKey(dateKey);
  date.setDate(date.getDate() + dayAmount);

  return createDateKey(date);
}

export function getMondayDateKey(dateKey) {
  const date = createDateFromKey(dateKey);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + mondayOffset);

  return createDateKey(date);
}

export function getWeekDateKeys(weekStartDate) {
  return Array.from({ length: 7 }, (_, index) =>
    addDaysToDateKey(weekStartDate, index),
  );
}

export function formatFullDateLabel(dateKey) {
  return createDateFromKey(dateKey).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export function formatShortDateLabel(dateKey) {
  return createDateFromKey(dateKey).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export function formatWeekRangeLabel(weekStartDate) {
  const weekEndDate = addDaysToDateKey(weekStartDate, 6);

  return `${weekStartDate} ~ ${weekEndDate}`;
}
