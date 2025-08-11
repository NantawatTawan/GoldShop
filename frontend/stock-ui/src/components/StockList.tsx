export interface StockItem {
  id: number;
  itemName: string;
  weightValue: number;
  unit: string;
  quantity: number;
  type: {
    id: number;
    name: string;
  };
}

interface Props {
  items: StockItem[];
}

const typeNameMap: Record<number, string> = {
  1: "แหวน",
  3: "สร้อยคอ",
  4: "สร้อยแขน",
  5: "กำไล",
  6: "ต่างหู",
  7: "ทองคำแท่ง",
  8: "อื่นๆ",
};

export default function StockList({ items }: Props) {
  const summary = items.reduce<Record<number, number>>((acc, item) => {
    const typeId = item.type?.id;
    const qty = item.quantity || 0;
    if (typeId && typeNameMap[typeId]) {
      acc[typeId] = (acc[typeId] || 0) + qty;
    }
    return acc;
  }, {});

  const maxQty = Math.max(...Object.values(summary), 1); // กันหาร 0

  return (
    <div className="bg-white p-4 rounded shadow h-full">
      <h2 className="text-xl font-semibold mb-4">
        สินค้าในคลัง (แยกตามประเภท)
      </h2>

      <ul className="space-y-4">
        {Object.entries(typeNameMap).map(([typeIdStr, name]) => {
          const typeId = Number(typeIdStr);
          const qty = summary[typeId] || 0;
          const percent = Math.round((qty / maxQty) * 100);

          return (
            <li key={typeId}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{name}</span>
                <span className="text-blue-700 font-semibold">{qty} ชิ้น</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-3">
                <div
                  className="bg-blue-500 h-3 rounded"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
