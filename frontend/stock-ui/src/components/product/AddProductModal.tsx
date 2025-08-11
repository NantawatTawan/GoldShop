import { useEffect, useState } from "react";
import axios from "axios";
import type { Product } from "../../pages/ProductPage";

interface StockType {
  id: number;
  name: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
  productToEdit?: Product | null;
  onDelete?: (id: number) => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
  onProductAdded,
  productToEdit,
}: AddProductModalProps) {
  const [itemName, setItemName] = useState("");
  const [weightValue, setWeightValue] = useState<number | "">("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [typeId, setTypeId] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [stockTypes, setStockTypes] = useState<StockType[]>([]);

  useEffect(() => {
    if (isOpen) {
      axios
        .get<StockType[]>("http://localhost:8080/api/stock-types")
        .then((res) => setStockTypes(res.data))
        .catch((err) => console.error("โหลดประเภทสินค้าล้มเหลว", err));

      if (productToEdit) {
        // ถ้าแก้ไข → เติมข้อมูลเดิม
        setItemName(productToEdit.itemName);
        setWeightValue(productToEdit.weightValue);
        setUnit(productToEdit.unit);
        setQuantity(productToEdit.quantity);
        setNote(productToEdit.note || "");
        setTypeId(productToEdit.type?.id || "");
      } else {
        // ถ้าเพิ่มใหม่ → ล้างข้อมูล
        setItemName("");
        setWeightValue("");
        setUnit("");
        setQuantity("");
        setNote("");
        setTypeId("");
      }
    }
  }, [isOpen, productToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      const data = {
        itemName,
        weightValue,
        unit,
        quantity,
        note,
        type: { id: typeId },
      };

      if (productToEdit?.id) {
        await axios.put(
          `http://localhost:8080/api/stock-items/${productToEdit.id}`,
          data
        );
      } else {
        await axios.post("http://localhost:8080/api/stock-items", data);
      }

      onProductAdded();
      onClose();
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการบันทึก:", err);
    }
  };
  const handleDelete = async () => {
    if (!productToEdit) return;
    if (!confirm("คุณแน่ใจว่าต้องการลบสินค้านี้หรือไม่?")) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/stock-items/${productToEdit.id}`
      );
      onProductAdded();
      onClose();
    } catch (err) {
      console.error("ลบสินค้าล้มเหลว", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50  bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">
          {productToEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        </h2>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="ชื่อสินค้า"
            className="w-full border px-3 py-2 rounded"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="น้ำหนัก"
              className="w-full border px-3 py-2 rounded"
              value={weightValue}
              onChange={(e) => setWeightValue(Number(e.target.value))}
            />
            <input
              type="text"
              placeholder="หน่วย (บาท/กรัม)"
              className="w-full border px-3 py-2 rounded"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>

          <input
            type="number"
            placeholder="จำนวน"
            className="w-full border px-3 py-2 rounded"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <select
            className="w-full border px-3 py-2 rounded"
            value={typeId}
            onChange={(e) => setTypeId(Number(e.target.value))}
          >
            <option value="">เลือกประเภทสินค้า</option>
            {stockTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <textarea
            placeholder="หมายเหตุ"
            className="w-full border px-3 py-2 rounded"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>

        <div className="flex justify-between gap-2 mt-4">
          {productToEdit && (
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              ลบ
            </button>
          )}
          <div className="flex gap-2 ml-auto">
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
              {productToEdit ? "อัปเดต" : "บันทึก"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
