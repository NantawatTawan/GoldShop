import DatePicker, { registerLocale } from "react-datepicker";
import { th } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";

registerLocale("th", th);

interface Props {
  value: string;
  onChange: (dateStr: string) => void;
}

export default function CustomDatePicker({ value, onChange }: Props) {
  const [internalDate, setInternalDate] = useState<Date | null>(null);

  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setInternalDate(parsed);
      }
    } else {
      setInternalDate(null);
    }
  }, [value]);

  const handleChange = (date: Date | null) => {
    setInternalDate(date);
    if (date) {
      const isoDate = date.toISOString().split("T")[0];
      onChange(isoDate);
    } else {
      onChange("");
    }
  };

  const years = Array.from(
    { length: 30 },
    (_, i) => new Date().getFullYear() - 29 + i
  );
  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  return (
    <DatePicker
      selected={internalDate}
      onChange={handleChange}
      dateFormat="dd/MM/yyyy"
      locale="th"
      placeholderText="เลือกวันที่"
      className="border px-3 py-2 rounded w-full"
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="flex justify-between px-2 py-1 items-center">
          <button
            type="button"
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="px-2"
          >
            {"<"}
          </button>

          <select
            value={date.getFullYear()}
            onChange={(e) => changeYear(parseInt(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year + 543}
              </option>
            ))}
          </select>

          <select
            value={date.getMonth()}
            onChange={(e) => changeMonth(parseInt(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="px-2"
          >
            {">"}
          </button>
        </div>
      )}
    />
  );
}
