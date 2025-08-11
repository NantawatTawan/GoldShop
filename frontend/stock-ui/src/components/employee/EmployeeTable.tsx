import DataTable from "../../components/ui/DataTable";
import type { Employee } from "../../pages/EmployeePage";
import { formatDateThaiFull } from "../ui/FormatDate";
interface Props {
  employees: Employee[];
  onDelete: (id: number) => void;
  onEdit: (employee: Employee) => void;
}

export default function EmployeeTable({ employees, onDelete, onEdit }: Props) {
  return (
    <DataTable
      data={employees}
      columns={[
        {
          header: "#",
          render: (_, i) => i + 1,
          width: "40px",
          className: "text-gray-500",
        },
        {
          header: "ชื่อ",
          render: (emp) => emp.fullName,
        },
        {
          header: "เบอร์โทร",
          render: (emp) => emp.phone,
        },
        {
          header: "ตำแหน่ง",
          render: (emp) => emp.position,
        },
        {
          header: "วันที่เริ่ม",
          render: (emp) => formatDateThaiFull(emp.startDate),
        },
        {
          header: "เงินเดือน",
          render: (emp) => emp.salary.toLocaleString() + " บาท",
        },
        {
          header: "สถานะ",
          render: (emp) => (emp.isActive ? "ใช้งาน" : "ไม่ใช้งาน"),
        },
        {
          header: "จัดการ",
          render: (emp) => (
            <div className="space-x-2">
              <button
                onClick={() => onEdit(emp)}
                className="text-yellow-700 hover:underline"
              >
                แก้ไข
              </button>
              <button
                onClick={() => onDelete(emp.id)}
                className="text-red-600 hover:underline"
              >
                ลบ
              </button>
            </div>
          ),
        },
      ]}
    />
  );
}
