import { useState, useEffect } from "react";
import axios from "axios";
import type { Product, StockType } from "../../pages/ProductPage";

type TransactionType = "SALE" | "PURCHASE" | "EXCHANGE";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTransactionSuccess?: () => void;
}

const initialPurchaseItem = {
  itemName: "",
  weightValue: "" as number | "",
  unit: "กรัม",
  quantity: 1,
  type: { id: "" as number | "" },
  note: "",
};

export default function TransactionModal({
  isOpen,
  onClose,
  onTransactionSuccess,
}: Props) {
  const [transactionType, setTransactionType] =
    useState<TransactionType>("SALE");
  const [products, setProducts] = useState<Product[]>([]);
  const [stockTypes, setStockTypes] = useState<StockType[]>([]);
  
  const [sellFilterType, setSellFilterType] = useState<string>("");

  const [itemsToSell, setItemsToSell] = useState([
    { stockItemId: "", quantity: 1 },
  ]);
  const [itemsToPurchase, setItemsToPurchase] = useState([
    initialPurchaseItem,
  ]);

  useEffect(() => {
    if (isOpen) {
      axios
        .get<Product[]>("http://localhost:8080/api/stock-items")
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Failed to fetch products", err));

      axios
        .get<StockType[]>("http://localhost:8080/api/stock-types")
        .then((res) => setStockTypes(res.data))
        .catch((err) => console.error("Failed to fetch stock types", err));
    } else {
      setTransactionType("SALE");
      setItemsToSell([{ stockItemId: "", quantity: 1 }]);
      setItemsToPurchase([initialPurchaseItem]);
      setSellFilterType("");
    }
  }, [isOpen]);

  const filteredProductsForSale = sellFilterType
    ? products.filter(p => p.type.id.toString() === sellFilterType)
    : products;

  const handleSubmit = async () => {
    const userDataString = localStorage.getItem("user");
    const userId = userDataString ? JSON.parse(userDataString).id : null;

    const payload = {
      type: transactionType,
      itemsToSell:
        transactionType === "PURCHASE"
          ? []
          : itemsToSell
              .filter((item) => item.stockItemId)
              .map((item) => ({
                stockItemId: parseInt(item.stockItemId, 10),
                quantity: item.quantity,
              })),
      itemsToPurchase:
        transactionType === "SALE"
          ? []
          : itemsToPurchase
              .filter((item) => item.itemName && item.weightValue && item.type.id)
              .map(item => ({...item, note: transactionType === "EXCHANGE" ? `(รายการเปลี่ยน) ${item.note}`: item.note})),
      userId: userId,
    };

    if (payload.type !== 'PURCHASE' && payload.itemsToSell.length === 0) {
        alert("กรุณาเลือกสินค้าที่ต้องการขายอย่างน้อย 1 รายการ");
        return;
    }
    if (payload.type !== 'SALE' && payload.itemsToPurchase.length === 0) {
        alert("กรุณากรอกข้อมูลสินค้าที่ต้องการซื้อเข้าอย่างน้อย 1 รายการ");
        return;
    }

    try {
      await axios.post("http://localhost:8080/api/transactions", payload);
      alert("บันทึกรายการสำเร็จ!");
      if (onTransactionSuccess) {
        onTransactionSuccess();
      }
      onClose();
    } catch (error: any) {
      console.error("Failed to create transaction", error);
      const message = error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกรายการ";
      alert(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">ทำรายการ ซื้อ/ขาย/เปลี่ยนทอง</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ประเภทรายการ
          </label>
          <select
            value={transactionType}
            onChange={(e) =>
              setTransactionType(e.target.value as TransactionType)
            }
            className="w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="SALE">ขายทอง (ออกจากสต็อก)</option>
            <option value="PURCHASE">รับซื้อทอง (เข้าสต็อก)</option>
            <option value="EXCHANGE">เปลี่ยนทอง</option>
          </select>
        </div>

        {(transactionType === "SALE" || transactionType === "EXCHANGE") && (
          <div className="border border-red-200 bg-red-50 p-4 rounded-md mb-4">
            <h3 className="font-semibold text-red-700 mb-3">
              {transactionType === 'EXCHANGE' ? 'ของที่ลูกค้าเอาไปใหม่ (ออกจากสต็อก)' : 'รายการขายออก'}
            </h3>
            
            <select 
              className="w-full border-gray-300 rounded-md shadow-sm mb-3"
              value={sellFilterType}
              onChange={e => setSellFilterType(e.target.value)}
            >
                <option value="">-- กรองตามประเภทสินค้า --</option>
                {stockTypes.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
            </select>

            {itemsToSell.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-2 mb-2">
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm"
                  value={item.stockItemId}
                  onChange={(e) => {
                    const newItems = [...itemsToSell];
                    newItems[index].stockItemId = e.target.value;
                    setItemsToSell(newItems);
                  }}
                >
                  <option value="">-- เลือกสินค้าในสต็อก --</option>
                  {filteredProductsForSale.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.itemName} (นน. {p.weightValue} {p.unit}) (เหลือ: {p.quantity})
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">จำนวน:</label>
                    <input
                        type="number"
                        min="1"
                        className="w-24 border-gray-300 rounded-md shadow-sm"
                        value={item.quantity}
                        onChange={(e) => {
                            const newItems = [...itemsToSell];
                            const newQuantity = parseInt(e.target.value, 10) || 1;
                            newItems[index].quantity = newQuantity > 0 ? newQuantity : 1;
                            setItemsToSell(newItems);
                        }}
                    />
                </div>
              </div>
            ))}
          </div>
        )}

        {(transactionType === "PURCHASE" ||
          transactionType === "EXCHANGE") && (
          <div className="border border-green-200 bg-green-50 p-4 rounded-md">
            <h3 className="font-semibold text-green-700 mb-3">
              {transactionType === 'EXCHANGE' ? 'ของที่ลูกค้านำมาเปลี่ยน (เข้าสต็อก)' : 'รายการซื้อเข้า'}
            </h3>
            {itemsToPurchase.map((item, index) => (
                 <div key={index} className="space-y-2 border-b border-green-200 pb-3 mb-3 last:border-b-0 last:mb-0">
                    <input type="text" placeholder="ชื่อสินค้า" className="w-full border-gray-300 rounded-md" 
                        value={item.itemName}
                        onChange={e => {
                            const newItems = [...itemsToPurchase];
                            newItems[index].itemName = e.target.value;
                            setItemsToPurchase(newItems);
                        }}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_auto] gap-2">
                         <input type="number" placeholder="น้ำหนัก" className="border-gray-300 rounded-md" 
                            value={item.weightValue}
                            onChange={e => {
                                const newItems = [...itemsToPurchase];
                                newItems[index].weightValue = e.target.value === '' ? '' : Number(e.target.value);
                                setItemsToPurchase(newItems);
                            }}
                         />
                         <input type="text" placeholder="หน่วย (บาท/กรัม)" className="border-gray-300 rounded-md" 
                            value={item.unit}
                            onChange={e => {
                                const newItems = [...itemsToPurchase];
                                newItems[index].unit = e.target.value;
                                setItemsToPurchase(newItems);
                            }}
                         />
                         {/* จุดที่แก้ไข */}
                         <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">จำนวน:</label>
                            <input type="number" min="1" className="w-24 border-gray-300 rounded-md" 
                                value={item.quantity}
                                onChange={e => {
                                    const newItems = [...itemsToPurchase];
                                    newItems[index].quantity = Number(e.target.value) > 0 ? Number(e.target.value) : 1;
                                    setItemsToPurchase(newItems);
                                }}
                            />
                         </div>
                    </div>
                     <select className="w-full border-gray-300 rounded-md"
                        value={item.type.id}
                        onChange={e => {
                            const newItems = [...itemsToPurchase];
                            newItems[index].type.id = e.target.value === '' ? '' : Number(e.target.value);
                            setItemsToPurchase(newItems);
                        }}
                     >
                         <option value="">-- เลือกประเภท --</option>
                         {stockTypes.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
                     </select>
                 </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            บันทึกรายการ
          </button>
        </div>
      </div>
    </div>
  );
}