import { useEffect, useState } from "react";
import axios from "axios";
import UserTable from "../components/user/UserTable";
import UserFormModal from "../components/user/UserFormModal";
import { Button } from "../components/ui/Button";

export interface User {
  id: number;
  username: string;
  role: {
    id: number;
    name: string;
  };
  employee: {
    id: number;
    fullName: string;
    position: string;
  } | null;
  isActive: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>("http://localhost:8080/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/users/${id}`);
      fetchUsers();
    } catch {
      alert("ลบไม่สำเร็จ");
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setShowModal(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.employee?.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">จัดการผู้ใช้</h1>
        <Button
          onClick={() => {
            setEditUser(null);
            setShowModal(true);
          }}
        >
          + เพิ่มผู้ใช้
        </Button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="ค้นหาชื่อผู้ใช้หรือชื่อพนักงาน"
        className="w-full border px-3 py-2 rounded shadow"
      />

      <UserTable
        users={filteredUsers}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {showModal && (
        <UserFormModal
          user={editUser}
          onClose={() => {
            setShowModal(false);
            setEditUser(null);
          }}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
}
