import { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  totalEvaluated: number;
  interestRate: number;
  interestPeriodMonths: number;
  previousRemainingAmount: number;
  onConfirm: (amountPaid: number, periodCountPaid: number) => void;
}

export default function InterestPaymentModal({
  isOpen,
  onClose,
  totalEvaluated,
  interestRate,
  interestPeriodMonths,
  previousRemainingAmount,
  onConfirm,
}: Props) {
  const [periodCountPaid, setPeriodCountPaid] = useState(1);
  const [amountPaid, setAmountPaid] = useState(0);
  const [expectedAmount, setExpectedAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [hasCustomAmount, setHasCustomAmount] = useState(false);
  useEffect(() => {
    const baseInterest =
      (totalEvaluated * interestRate * periodCountPaid) / 100;
    const totalExpected = baseInterest + previousRemainingAmount;

    setExpectedAmount(totalExpected);

    if (!hasCustomAmount) {
      setAmountPaid(totalExpected);
    }

    setRemainingAmount(Math.max(totalExpected - amountPaid, 0));
  }, [
    totalEvaluated,
    interestRate,
    periodCountPaid,
    amountPaid,
    previousRemainingAmount,
    hasCustomAmount,
  ]);
  useEffect(() => {
    if (isOpen) {
      setPeriodCountPaid(1);
      setHasCustomAmount(false);
      setAmountPaid(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-blue-700">
          ยืนยันการจ่ายดอกเบี้ย
        </h2>

        <ul className="text-sm text-gray-700 space-y-1">
          <li>
            📆 งวดที่จ่าย: <b>{periodCountPaid}</b> งวด (
            <b>{periodCountPaid * interestPeriodMonths} เดือน</b>)
          </li>
          <li>
            🧾 ยอดค้างจากรอบก่อน:{" "}
            <b>{previousRemainingAmount.toLocaleString()} บาท</b>
          </li>
          <li>
            💰 ดอกเบี้ยที่ต้องชำระทั้งหมด:{" "}
            <b>{expectedAmount.toLocaleString()} บาท</b>
          </li>
          <li>
            🧾 ยอดที่ยังค้างหลังจ่าย:{" "}
            <b
              className={
                remainingAmount > 0 ? "text-red-600" : "text-green-600"
              }
            >
              {remainingAmount.toLocaleString()} บาท
            </b>
          </li>
        </ul>

        <div className="space-y-1">
          <label
            htmlFor="periodCount"
            className="text-sm font-medium text-gray-800 mt-2 block"
          >
            📆 จำนวนงวดที่ลูกค้าต้องการจ่าย
          </label>
          <input
            id="periodCount"
            type="number"
            min="1"
            value={periodCountPaid}
            onChange={(e) => setPeriodCountPaid(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 text-right"
          />
          <label htmlFor="amount" className="text-sm font-medium text-gray-800">
            💸 จำนวนเงินที่ลูกค้าจ่ายจริง (บาท)
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            value={amountPaid}
            onChange={(e) => {
              setAmountPaid(Number(e.target.value));
              setHasCustomAmount(true);
            }}
            className="w-full border rounded px-3 py-2 text-right"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => {
              if (amountPaid <= 0) {
                alert("กรุณาระบุจำนวนเงินที่จ่ายจริง");
                return;
              }
              if (
                confirm(
                  `ยืนยันว่าลูกค้าจ่ายดอกเบี้ย ${amountPaid.toLocaleString()} บาท ใช่หรือไม่?`
                )
              ) {
                onConfirm(amountPaid, periodCountPaid);
              }
            }}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            ยืนยันจ่ายดอกเบี้ย
          </button>
        </div>
      </div>
    </div>
  );
}
