import dayjs from "dayjs";

const thaiMonths = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

// แบบ 26/6/2568
export function formatDateToBuddhist(dateStr: string): string {
  const date = dayjs(dateStr);
  const buddhistYear = date.year() + 543;
  return `${date.date()}/${date.month() + 1}/${buddhistYear}`;
}

// แบบ 26 มิ.ย. 2568
export function formatDateThaiFull(dateStr: string): string {
  const date = dayjs(dateStr);
  const buddhistYear = date.year() + 543;
  const month = thaiMonths[date.month()];
  return `${date.date()} ${month} ${buddhistYear}`;
}
