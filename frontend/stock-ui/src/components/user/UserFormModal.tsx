import { useEffect, useState } from "react";
import axios from "axios";
import type { User } from "../../pages/UserPage";

interface Role {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  fullName: string;
}

interface Props {
  isOpen?: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export default function UserFormModal({
  isOpen = true,
  onClose,
  onSuccess,
  user,
}: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (isOpen) {
      axios
        .get("http://localhost:8080/api/employees")
        .then((res) => setEmployees(res.data));
      axios
        .get("http://localhost:8080/api/roles")
        .then((res) => setRoles(res.data));
    }
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmployeeId(user.employee?.id || null);
      setRoleId(user.role?.id || null);
    } else {
      setUsername("");
      setEmployeeId(null);
      setRoleId(null);
      setPassword("");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !roleId || !username || (!user && !password)) return;

    const userData = {
      username,
      passwordHash: password,
      role: { id: roleId },
      employee: { id: employeeId },
      isActive: true,
    };

    try {
      if (user) {
        await axios.put(`http://localhost:8080/api/users/${user.id}`, userData);
      } else {
        await axios.post("http://localhost:8080/api/users", userData);
      }
      onSuccess();
      onClose();
    } catch {
      alert("เกิดข้อผิดพลาด");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">
          {user ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้"}
        </h2>

        <label className="block mb-1">ชื่อผู้ใช้</label>
        <input
          className="border w-full mb-3 px-3 py-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block mb-1">
          {user ? "เปลี่ยนรหัสผ่าน (ถ้าต้องการ)" : "รหัสผ่าน"}
        </label>
        <input
          type="password"
          className="border w-full mb-3 px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={user ? "เว้นว่างหากไม่ต้องการเปลี่ยน" : ""}
        />

        <label className="block mb-1">พนักงาน</label>
        <select
          className="border w-full mb-3 px-3 py-2 rounded"
          value={employeeId ?? ""}
          onChange={(e) => setEmployeeId(Number(e.target.value))}
        >
          <option value="">-- เลือกพนักงาน --</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.fullName}
            </option>
          ))}
        </select>

        <label className="block mb-1">บทบาท</label>
        <select
          className="border w-full mb-4 px-3 py-2 rounded"
          value={roleId ?? ""}
          onChange={(e) => setRoleId(Number(e.target.value))}
        >
          <option value="">-- เลือกบทบาท --</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
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
