const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Archive-style date, for example 2026.09.05. */
export function formatRecordDate(date: Date): string {
  return dateFormatter.format(date).replaceAll("/", ".");
}

export function toDateTime(date: Date): string {
  return date.toISOString();
}
