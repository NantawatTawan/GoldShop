import { useState, useEffect } from "react";
import axios from "axios";
import EmployeeTable from "../components/employee/EmployeeTable";
import EmployeeFormModal from "../components/employee/EmployeeFormModal";

export interface Employee {
  id: number;
  fullName: string;
  phone: string;
  position: string;
  startDate: string;
  salary: number;
  isActive: boolean;
}

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | undefined>(
    undefined
  );

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/employees");
      const data = res.data;

      if (!Array.isArray(data)) {
        console.error("ไม่ใช่ array:", data);
        return;
      }
      setEmployees(data);
    } catch {
      alert("โหลดข้อมูลพนักงานไม่สำเร็จ");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ลบพนักงานนี้หรือไม่?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/employees/${id}`);
      fetchEmployees();
    } catch {
      alert("ลบไม่สำเร็จ");
    }
  };

  const handleEdit = (emp: Employee) => {
    setEditEmployee(emp);
    setShowModal(true);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filtered = employees.filter((e) =>
    e.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-red-700">รายการพนักงาน</h1>
        <button
          onClick={() => {
            setEditEmployee(undefined);
            setShowModal(true);
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ เพิ่มพนักงาน
        </button>
      </div>

      <input
        type="text"
        placeholder="ค้นหาชื่อพนักงาน"
        className="border px-3 py-2 rounded w-72"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <EmployeeTable
        employees={filtered}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {showModal && (
        <EmployeeFormModal
          employee={editEmployee}
          onClose={() => {
            setShowModal(false);
            setEditEmployee(undefined);
          }}
          onRefresh={fetchEmployees}
        />
      )}
    </div>
  );
}
