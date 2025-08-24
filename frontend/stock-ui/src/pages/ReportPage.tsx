import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ReportData {
  incomeExpenses: {
    pawnToday: number;
    pawnThisMonth: number;
    interestThisMonth: number;
  };
  stock: {
    totalItemCount: number;
    totalGoldBaht: number;
    totalGoldGrams: number;
  };
  pawn: {
    newCustomersToday: number;
    newCustomersThisMonth: number;
    outstandingItemsCount: number;
    overdueItems: OverdueItem[];
  };
  overdueCustomers: OverdueCustomer[];
}

interface OverdueItem {
  id: number;
  customerName: string;
  pawnNumber: string;
  dueDate: string;
}

interface OverdueCustomer {
  id: number;
  name: string;
  phone: string;
  overdueDays: number;
}

const StatCard = ({
  title,
  value,
  unit,
}: {
  title: string;
  value: string | number;
  unit: string;
}) => (
  <div className="bg-white p-4 rounded-lg shadow transition-transform hover:scale-105">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-1 text-2xl font-semibold text-gray-900">
      {typeof value === "number" ? value.toLocaleString() : value}{" "}
      <span className="text-base font-normal">{unit}</span>
    </p>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-bold text-red-700 mb-4 border-b pb-2">
      {title}
    </h2>
    {children}
  </div>
);

export default function ReportPage() {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/reports/full")
      .then((res) => {
        setReportData(res.data);
      })
      .catch((err) => console.error("Failed to fetch report data", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">กำลังโหลดข้อมูลรายงาน...</div>;
  }

  if (!reportData) {
    return <div className="p-6 text-red-500">ไม่สามารถโหลดข้อมูลรายงานได้</div>;
  }

  const { incomeExpenses, stock, pawn, overdueCustomers } = reportData;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">หน้ารายงานสรุป</h1>

      <Section title="📊 รายได้ / รายจ่าย">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            title="ยอดจำนำวันนี้"
            value={incomeExpenses.pawnToday}
            unit="บาท"
          />
          <StatCard
            title="ยอดจำนำเดือนนี้"
            value={incomeExpenses.pawnThisMonth}
            unit="บาท"
          />
          <StatCard
            title="ดอกเบี้ยรับเดือนนี้"
            value={incomeExpenses.interestThisMonth}
            unit="บาท"
          />
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="📦 สต็อกสินค้า">
          <div className="border-t pt-4 space-y-2">
            <h3 className="font-semibold text-gray-800">จำนวนทองรวมในสต็อก</h3>
            <p className="text-lg font-bold">
              {stock.totalGoldBaht.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-base font-normal">บาท</span>
            </p>
            <p className="text-lg font-bold">
              {stock.totalGoldGrams.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-base font-normal">กรัม</span>
            </p>
          </div>
        </Section>

        <Section title="💰 จำนำ">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="ลูกค้าใหม่ (วันนี้)"
              value={pawn.newCustomersToday}
              unit="คน"
            />
            <StatCard
              title="ลูกค้าใหม่ (เดือนนี้)"
              value={pawn.newCustomersThisMonth}
              unit="คน"
            />
            <StatCard
              title="รายการที่ยังไม่ถอน"
              value={pawn.outstandingItemsCount}
              unit="รายการ"
            />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800">รายการที่เลยกำหนด</h3>
            <ul className="divide-y divide-gray-200 mt-2 max-h-40 overflow-y-auto">
              {pawn.overdueItems.map((item) => (
                <li
                  key={item.id}
                  className="py-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {item.customerName}{" "}
                      <span className="text-sm text-gray-600">
                        ({item.pawnNumber})
                      </span>
                    </p>
                    <p className="text-sm text-red-500">
                      ครบกำหนด: {item.dueDate}
                    </p>
                  </div>
                  <button
                    className="text-sm text-white bg-blue-500 hover:bg-blue-600 rounded px-3 py-1"
                    onClick={() => navigate(`/pawn/${item.id}`)}
                  >
                    ดู
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </div>

      <Section title="👥 ลูกค้าที่ค้างเกินกำหนด">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-yellow-100">
              <tr>
                <th className="text-left py-2 px-4">ชื่อลูกค้า</th>
                <th className="text-left py-2 px-4">เบอร์โทร</th>
                <th className="text-left py-2 px-4">เลยกำหนด (วัน)</th>
                <th className="text-left py-2 px-4">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {overdueCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-yellow-50">
                  <td className="py-2 px-4">{cust.name}</td>
                  <td className="py-2 px-4">{cust.phone}</td>
                  <td className="py-2 px-4 text-red-600 font-semibold">
                    {cust.overdueDays}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => navigate(`/customers/detail/${cust.id}`)}
                    >
                      ดูข้อมูลลูกค้า
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
