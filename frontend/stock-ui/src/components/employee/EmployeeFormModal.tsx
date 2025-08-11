import { useEffect, useState } from "react";
import type { Employee } from "../../pages/EmployeePage";
import CustomDatePicker from "../ui/CustomDatePicker";
import { formatDateThaiFull } from "../ui/FormatDate";
interface Props {
  employee?: Employee;
  onClose: () => void;
  onRefresh: () => void;
}

export default function EmployeeFormModal({
  employee,
  onClose,
  onRefresh,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [salary, setSalary] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (employee) {
      setFullName(employee.fullName);
      setPhone(employee.phone);
      setPosition(employee.position);
      setStartDate(employee.startDate);
      setSalary(employee.salary);
      setIsActive(employee.isActive);
    } else {
      setFullName("");
      setPhone("");
      setPosition("");
      setStartDate("");
      setSalary(0);
      setIsActive(true);
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      fullName,
      phone,
      position,
      startDate,
      salary,
      isActive,
    };

    try {
      if (employee) {
        await fetch(`http://localhost:8080/api/employees/${employee.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://localhost:8080/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      onRefresh();
      onClose();
    } catch {
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="fixed inset-0  bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">
          {employee ? "แก้ไขพนักงาน" : "เพิ่มพนักงาน"}
        </h2>

        <label className="block mb-1">ชื่อ-นามสกุล</label>
        <input
          className="border w-full mb-3 px-3 py-2 rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label className="block mb-1">เบอร์โทร</label>
        <input
          className="border w-full mb-3 px-3 py-2 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="block mb-1">ตำแหน่ง</label>
        <input
          className="border w-full mb-3 px-3 py-2 rounded"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />

        <label className="block mb-1">วันที่เริ่มงาน</label>
        <CustomDatePicker value={startDate} onChange={setStartDate} />

        {startDate && (
          <div className="text-sm text-gray-500 mb-3">
            {formatDateThaiFull(startDate)}
          </div>
        )}

        <label className="block mb-1">เงินเดือน</label>
        <input
          type="number"
          className="border w-full mb-3 px-3 py-2 rounded"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
        />

        <label className="block mb-1">สถานะ</label>
        <select
          className="border w-full mb-4 px-3 py-2 rounded"
          value={isActive ? "true" : "false"}
          onChange={(e) => setIsActive(e.target.value === "true")}
        >
          <option value="true">ใช้งาน</option>
          <option value="false">ไม่ใช้งาน</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}
