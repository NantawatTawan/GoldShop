import { useState } from "react";
import axios from "axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCustomerAdded: () => void;
}

export default function AddCustomerModal({
  isOpen,
  onClose,
  onCustomerAdded,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      alert("กรุณากรอกชื่อและเบอร์โทร");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/customers", { name, phone });
      onCustomerAdded();
      onClose();
      setName("");
      setPhone("");
    } catch (err) {
      console.error("เพิ่มลูกค้าไม่สำเร็จ", err);
      alert("ไม่สามารถเพิ่มลูกค้าได้");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-black/30 z-50">
      <div className="bg-white rounded p-6 w-96 space-y-4 shadow-lg">
        <h2 className="text-xl font-bold">เพิ่มลูกค้าใหม่</h2>

        <input
          type="text"
          placeholder="ชื่อลูกค้า"
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="เบอร์โทร"
          className="w-full border px-3 py-2 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={loading}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}
