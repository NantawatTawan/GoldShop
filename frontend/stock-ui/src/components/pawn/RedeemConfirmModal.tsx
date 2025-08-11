import { useState } from "react";

interface RedeemConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  pawnNumber: string;
  totalEvaluated: number;
  items: { productName: string; note: string }[];
  onConfirm: () => void;
}

export default function RedeemConfirmModal({
  isOpen,
  onClose,
  pawnNumber,
  totalEvaluated,
  items,
  onConfirm,
}: RedeemConfirmModalProps) {
  const [doubleCheck, setDoubleCheck] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          ✅ ตรวจสอบการไถ่ถอน
        </h2>

        <div>
          <p className="text-sm text-gray-600 mb-1">
            เลขที่ใบจำนำ: {pawnNumber}
          </p>
          <p className="text-sm font-medium text-gray-700">
            💰 ยอดไถ่ถอน: {totalEvaluated.toLocaleString()} บาท
          </p>
        </div>

        <div>
          <h3 className="font-medium text-sm text-gray-700 mb-1">
            📦 รายการของ
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {items.map((item, idx) => (
              <li key={idx}>
                {item.productName} {item.note && <span>({item.note})</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="doubleCheck"
            checked={doubleCheck}
            onChange={() => setDoubleCheck(!doubleCheck)}
          />
          <label htmlFor="doubleCheck" className="text-sm text-gray-700">
            ยืนยันว่าได้ตรวจสอบยอดและรายการของเรียบร้อยแล้ว
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            ยกเลิก
          </button>
          <button
            disabled={!doubleCheck}
            onClick={() => {
              if (
                confirm(
                  "คุณแน่ใจหรือไม่ว่าต้องการไถ่ถอน? การดำเนินการจะไม่สามารถย้อนกลับได้"
                )
              ) {
                onConfirm();
              }
            }}
            className={`px-4 py-1 text-sm rounded text-white ${
              doubleCheck
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            ยืนยันการไถ่ถอน
          </button>
        </div>
      </div>
    </div>
  );
}
