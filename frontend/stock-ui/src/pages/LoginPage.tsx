import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          username,
          password,
        }
      );

      const user = response.data;

      // บันทึกข้อมูล user ลง localStorage หรือ context ถ้าใช้
      localStorage.setItem("user", JSON.stringify(user));

      // นำทางไปหน้า dashboard
      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          setError(err.response.data);
        } else {
          setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
        }
      } else {
        setError("ติดต่อเจ้าหน้าที่ให้แก้ไข");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7e6c4] to-[#f1c376]">
      <div className="bg-[#FFF4F4] shadow-2xl rounded-2xl p-10 w-full max-w-sm border border-[#F1C376]">
        <h2 className="text-3xl font-bold text-center text-[#606C5D] mb-6">
          Maneelak Gold
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm rounded px-4 py-2 mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label className="block mb-1 text-[#606C5D] font-medium">
            ชื่อผู้ใช้
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-[#F1C376] rounded focus:outline-none focus:ring-2 focus:ring-[#F1C376]"
          />

          <label className="block mb-1 text-[#606C5D] font-medium">
            รหัสผ่าน
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-6 border border-[#F1C376] rounded focus:outline-none focus:ring-2 focus:ring-[#F1C376]"
          />

          <button
            type="submit"
            className="w-full bg-[#606C5D] hover:bg-[#4f5d4d] text-white py-2 rounded font-semibold"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}
