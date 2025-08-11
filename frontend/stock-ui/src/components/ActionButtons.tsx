import { useState } from "react";
import AddPawnModal from "./pawn/AddPawnModal";
export default function ActionButtons() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">ทำรายการ</h2>
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full text-center bg-green-500 text-white hover:bg-green-600 px-4 py-3 rounded transition font-medium "
        >
          💰 ขายฝากทอง (จำนำ)
        </button>
        <button className="w-full text-center bg-yellow-400 text-white hover:bg-yellow-500 px-4 py-3 rounded transition font-medium ">
          🔄 ซื้อ/ขาย/เปลี่ยนทอง
        </button>
        <button className="w-full text-center bg-purple-500 text-white hover:bg-purple-600 px-4 py-3 rounded transition font-medium ">
          🏦 ออมทอง
        </button>
        <AddPawnModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPawnAdded={() => {}}
        />
      </div>
    </div>
  );
}
