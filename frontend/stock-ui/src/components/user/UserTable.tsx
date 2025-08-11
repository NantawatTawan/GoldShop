import type { User } from "../../pages/UserPage";

interface Props {
  users: User[];
  onDelete: (id: number) => void;
  onEdit: (user: User) => void;
}

export default function UserTable({ users, onDelete, onEdit }: Props) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              #
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              ชื่อผู้ใช้
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              ชื่อพนักงาน
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              ตำแหน่ง
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              บทบาท
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              สถานะ
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              จัดการ
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user, index) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm">{index + 1}</td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {user.username}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {user.employee?.fullName || "-"}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {user.employee?.position || "-"}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {user.role?.name}
              </td>
              <td className="px-4 py-2 text-sm">
                <span
                  className={
                    user.isActive
                      ? "text-green-600 font-medium"
                      : "text-gray-400"
                  }
                >
                  {user.isActive ? "ใช้งานอยู่" : "ไม่ใช้งาน"}
                </span>
              </td>
              <td className="px-4 py-2 text-sm space-x-2">
                <button
                  onClick={() => onEdit(user)}
                  className="text-yellow-600 hover:underline"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => {
                    if (confirm("ต้องการลบผู้ใช้นี้จริงหรือไม่?")) {
                      onDelete(user.id);
                    }
                  }}
                  className="text-red-600 hover:underline"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
