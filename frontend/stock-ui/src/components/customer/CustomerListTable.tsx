import { useNavigate } from "react-router-dom";
import DataTable from "../../components/ui/DataTable";
import type { Customer } from "../../pages/CustomerPage";

interface Props {
  customers: Customer[];
  onDelete: (id: number) => void;
}

export default function CustomerListTable({ customers, onDelete }: Props) {
  const navigate = useNavigate();

  const columns = [
    {
      header: "#",
      render: (_: Customer, index: number) => index + 1,
      className: "w-12 text-gray-500",
    },
    {
      header: "ชื่อลูกค้า",
      render: (c: Customer) => c.name,
    },
    {
      header: "เบอร์โทร",
      render: (c: Customer) => c.phone,
    },
    {
      header: "การจัดการ",
      render: (c: Customer) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(c.id);
          }}
          className="text-red-600 hover:underline text-sm"
        >
          ลบ
        </button>
      ),
    },
  ];

  return (
    <DataTable
      data={customers}
      columns={columns}
      onRowClick={(item) => navigate(`/customers/detail/${item.id}`)}
    />
  );
}
