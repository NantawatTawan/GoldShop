import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPawnAdded: () => void;
}

const getTodayBE = () => {
  const today = new Date();
  return {
    day: today.getDate(),
    month: today.getMonth() + 1,
    yearBE: today.getFullYear() + 543,
  };
};

const getThaiDayName = (dateStr: string): string => {
  const dayNames = [
    "วันอาทิตย์",
    "วันจันทร์",
    "วันอังคาร",
    "วันพุธ",
    "วันพฤหัสบดี",
    "วันศุกร์",
    "วันเสาร์",
  ];
  const date = dayjs(dateStr).toDate();
  return dayNames[date.getDay()];
};

const thaiMonths = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม.",
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

export default function AddPawnModal({ isOpen, onClose, onPawnAdded }: Props) {
  const today = getTodayBE();
  const [customerId, setCustomerId] = useState("");
  const [day, setDay] = useState(today.day);
  const [month, setMonth] = useState(today.month);
  const [yearBE, setYearBE] = useState(today.yearBE);
  const [dueDate, setDueDate] = useState("");
  const [dueParts, setDueParts] = useState<{
    day: number;
    month: number;
    yearBE: number;
  } | null>(null);
  const [interestPeriodMonths, setInterestPeriodMonths] = useState("1");
  const [interestRate, setInterestRate] = useState("2");
  const [givenAmount, setGivenAmount] = useState(0);

  const [items, setItems] = useState([
    {
      productName: "",
      note: "",
    },
  ]);

  useEffect(() => {
    const yearAD = yearBE - 543;
    const dateStr = `${yearAD}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const newDue = dayjs(dateStr)
      .add(Number(interestPeriodMonths), "month")
      .format("YYYY-MM-DD");
    setDueDate(newDue);

    const due = dayjs(newDue);
    setDueParts({
      day: due.date(),
      month: due.month() + 1,
      yearBE: due.year() + 543,
    });
  }, [day, month, yearBE, interestPeriodMonths]);

  const totalInterest =
    givenAmount * (Number(interestRate) / 100) * Number(interestPeriodMonths);

  const handleItemChange = (
    index: number,
    field: keyof (typeof items)[0],
    value: string
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { productName: "", note: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleSubmit = async () => {
    if (!customerId || givenAmount <= 0) {
      alert("กรอกรหัสลูกค้าและจำนวนเงินให้ลูกค้าให้ครบ");
      return;
    }

    const yearAD = yearBE - 543;
    const pawnDate = `${yearAD}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    try {
      await axios.post("http://localhost:8080/api/pawns", {
        customerId: Number(customerId),
        createdByUserId: 1,
        pawnDate,
        dueDate,
        interestRate: Number(interestRate),
        totalEvaluated: givenAmount,
        givenAmount,
        interestPeriodMonths: Number(interestPeriodMonths),
        items,
      });
      onPawnAdded();
      onClose();
    } catch (err) {
      console.error("เพิ่มรายการจำนำไม่สำเร็จ", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">เพิ่มรายการจำนำ</h2>
        <div className="space-y-3">
          <div>
            <label className="block mb-1">🔢 รหัสลูกค้า</label>
            <input
              type="text"
              placeholder="กรอกรหัสลูกค้า"
              className="border px-3 py-2 w-full rounded"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">📅 วันที่จำนำ</label>
            <div className="flex gap-2">
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="border px-2 py-1 rounded w-1/3"
              >
                {[...Array(31)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="border px-2 py-1 rounded w-1/3"
              >
                {thaiMonths.map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={yearBE}
                onChange={(e) => setYearBE(Number(e.target.value))}
                className="border px-2 py-1 rounded w-1/3"
              >
                {[...Array(6)].map((_, i) => (
                  <option key={i} value={today.yearBE - 3 + i}>
                    {today.yearBE - 3 + i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1">📆 วันที่ครบกำหนด</label>
            <input
              type="text"
              readOnly
              className="border px-3 py-2 w-full rounded bg-gray-100"
              value={
                dueParts
                  ? `${String(dueParts.day).padStart(2, "0")}/${
                      thaiMonths[dueParts.month - 1]
                    }/${dueParts.yearBE}`
                  : ""
              }
            />
            {dueParts && (
              <p className="text-sm text-gray-600 mt-1">
                {getThaiDayName(dueDate)}ที่ {dueParts.day}{" "}
                {thaiMonths[dueParts.month - 1]} {dueParts.yearBE}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">🗓 รอบชำระดอกเบี้ย</label>
            <select
              className="border px-3 py-2 w-full rounded"
              value={interestPeriodMonths}
              onChange={(e) => setInterestPeriodMonths(e.target.value)}
            >
              <option value="1">ทุก 1 เดือน</option>
              <option value="2">ทุก 2 เดือน</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">💰 ดอกเบี้ย (%)</label>
            <input
              type="number"
              className="border px-3 py-2 w-full rounded"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">📦 รายการของจำนำ</label>
            {items.map((item, i) => (
              <div
                key={i}
                className="border p-3 rounded mb-2 space-y-2 bg-gray-50"
              >
                <input
                  type="text"
                  placeholder="ชื่อสินค้า"
                  className="border px-2 py-1 w-full rounded"
                  value={item.productName}
                  onChange={(e) =>
                    handleItemChange(i, "productName", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="หมายเหตุ"
                  className="border px-2 py-1 w-full rounded"
                  value={item.note}
                  onChange={(e) => handleItemChange(i, "note", e.target.value)}
                />
                {items.length > 1 && (
                  <div className="text-right">
                    <button
                      onClick={() => removeItem(i)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      🗑 ลบรายการนี้
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button onClick={addItem} className="text-sm text-blue-600 mt-1">
              + เพิ่มสินค้า
            </button>
          </div>

          <div>
            <label className="block mb-1">💵 จำนวนเงินที่ให้ลูกค้า</label>
            <input
              type="number"
              className="border px-3 py-2 w-full rounded"
              value={givenAmount}
              onChange={(e) => setGivenAmount(Number(e.target.value))}
              min={0}
            />
            <p className="mt-2">
              📊 ดอกเบี้ยที่ต้องชำระ:{" "}
              <strong>{totalInterest.toLocaleString()} บาท</strong>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
