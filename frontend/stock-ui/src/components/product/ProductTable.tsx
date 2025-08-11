import DataTable from "../ui/DataTable";
import type { Product } from "../../pages/ProductPage";

interface Props {
  products: Product[];
  onDelete: (id: number) => void;
  onEdit: (product: Product) => void;
}

export default function ProductTable({ products, onEdit }: Props) {
  return (
    <DataTable
      data={products}
      columns={[
        {
          header: "#",
          render: (_, index) => index + 1,
          width: "40px",
        },
        {
          header: "ชื่อสินค้า",
          render: (item) => item.itemName,
        },
        {
          header: "ประเภท",
          render: (item) => item.type?.name || "-",
        },
        {
          header: "น้ำหนัก",
          render: (item) => `${item.weightValue} ${item.unit}`,
        },
        {
          header: "จำนวน",
          render: (item) => (
            <span className="text-blue-700 font-semibold">{item.quantity}</span>
          ),
        },
        {
          header: "หมายเหตุ",
          render: (item) => item.note || "-",
        },
        {
          header: "จัดการ",
          render: (item) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="px-2 py-1 text-sm text-white bg-gray-600 hover:bg-gray-700 rounded"
            >
              จัดการ
            </button>
          ),
        },
      ]}
    />
  );
}
