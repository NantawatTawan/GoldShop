import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

function CustomLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: string;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded hover:bg-yellow-300 transition ${
          isActive
            ? "bg-yellow-300 font-semibold text-green-800"
            : "text-gray-800"
        }`
      }
    >
      <span>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function MainLayout() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // ใส่ logic logout จริงตรงนี้ถ้ามี (เช่น clear localStorage)
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Top bar (mobile only) */}
      <header className="md:hidden p-4  justify-between items-center bg-yellow-100 shadow">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-3xl text-gray-700 "
        >
          ☰
        </button>
      </header>

      {/* Sidebar ด้านซ้าย */}
      <aside className="hidden md:flex w-64 bg-yellow-100 p-4 shadow-inner flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-center text-red-700 mb-6">
            Maneelak Gold
          </h2>
          <nav className="flex flex-col gap-1">
            <CustomLink to="/dashboard" icon="📊" label="Dashboard" />
            <CustomLink to="/products" icon="📦" label="สินค้า" />
            <CustomLink to="/pawn" icon="💰" label="จำนำ" />
            <CustomLink to="/customers" icon="👤" label="ลูกค้า" />
            <CustomLink to="/employees" icon="👥" label="พนักงาน" />
            <CustomLink to="/users" icon="🔐" label="ผู้ใช้" />
            <CustomLink to="/reports" icon="📑" label="รายงาน" />
            <CustomLink to="/notifications" icon="🔔" label="แจ้งเตือน" />
          </nav>
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-gray-600 text-center mb-2">🧑‍💼 มณีลักษณ์</p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm"
          >
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 bg-gray-50">
        {/* เนื้อหาแต่ละหน้า */}
        <Outlet />
      </main>

      {/* Drawer menu (mobile) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 z-50">
          <div className="w-64 bg-yellow-100 h-full p-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-700">เมนู</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              <CustomLink to="/dashboard" icon="📊" label="Dashboard" />
              <CustomLink to="/products" icon="📦" label="สินค้า" />
              <CustomLink to="/pawn" icon="💰" label="จำนำ" />
              <CustomLink to="/customers" icon="👤" label="ลูกค้า" />
              <CustomLink to="/employees" icon="👥" label="พนักงาน" />
              <CustomLink to="/users" icon="🔐" label="ผู้ใช้" />
              <CustomLink to="/reports" icon="📑" label="รายงาน" />
              <CustomLink to="/notifications" icon="🔔" label="แจ้งเตือน" />
            </nav>

            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-red-500 text-white py-2 rounded text-sm"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
