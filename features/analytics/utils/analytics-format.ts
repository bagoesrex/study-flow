export function formatHours(hours: number) {
  return `${hours.toFixed(1)}h`;
}

export function formatMinutesToHours(minutes: number) {
  return Number((minutes / 60).toFixed(1));
}

export function formatPercentage(value: number) {
  return `${value}%`;
}

export function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
