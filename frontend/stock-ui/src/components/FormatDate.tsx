function normalizeDateString(dateStr: string): string {
  return dateStr.replace(/(\.\d{3})\d*/, "$1");
}

export default function formatDate(dateStr: string): string {
  const normalized = normalizeDateString(dateStr);
  const dateObj = new Date(normalized);
  const formatter = new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return formatter.format(dateObj);
}
