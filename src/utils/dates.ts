const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

export function toDateTime(date: Date): string {
  return date.toISOString();
}
