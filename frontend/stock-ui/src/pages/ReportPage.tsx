import { reportData } from "../data/reportMockData";
import { useNavigate } from "react-router-dom";

// Helper component for displaying stats
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
  const { income_expenses, stock, pawn, customers } = reportData;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">หน้ารายงานสรุป</h1>

      {/* Income / Expenses Section */}
      <Section title="📊 รายได้ / รายจ่าย">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="ยอดจำนำวันนี้"
            value={income_expenses.pawn_today}
            unit="บาท"
          />
          <StatCard
            title="ยอดจำนำเดือนนี้"
            value={income_expenses.pawn_this_month}
            unit="บาท"
          />
          <StatCard
            title="รายได้ขาย/เปลี่ยน"
            value={income_expenses.sales_income}
            unit="บาท"
          />
          <StatCard
            title="ยอดถอนสินค้า"
            value={income_expenses.redeem_amount}
            unit="บาท"
          />
          <StatCard
            title="ดอกเบี้ยที่ควรได้(วันนี้)"
            value={income_expenses.expected_interest_today}
            unit="บาท"
          />
          <StatCard
            title="ดอกเบี้ยที่ควรได้(เดือนนี้)"
            value={income_expenses.expected_interest_this_month}
            unit="บาท"
          />
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Section */}
        <Section title="📦 สต็อกสินค้า">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">
                รายการสินค้าในร้าน
              </h3>
              <ul className="divide-y divide-gray-200 mt-2 max-h-60 overflow-y-auto">
                {stock.items.map((item) => (
                  <li
                    key={item.id}
                    className="py-2 flex justify-between items-center"
                  >
                    <span>
                      {item.name}{" "}
                      <span className="text-xs text-gray-500">
                        ({item.type})
                      </span>
                    </span>
                    <span className="font-medium text-blue-600">
                      {item.quantity} ชิ้น
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t pt-4 space-y-2">
              <h3 className="font-semibold text-gray-800">
                จำนวนทองรวมในสต็อก
              </h3>
              <p className="text-lg font-bold">
                {stock.total_gold_baht.toLocaleString()}{" "}
                <span className="text-base font-normal">บาท</span>
              </p>
              <p className="text-lg font-bold">
                {stock.total_gold_grams.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <span className="text-base font-normal">กรัม</span>
              </p>
            </div>
          </div>
        </Section>

        {/* Pawn Section */}
        <Section title="💰 จำนำ">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="ลูกค้าใหม่ (วันนี้)"
              value={pawn.new_customers_today}
              unit="คน"
            />
            <StatCard
              title="ลูกค้าใหม่ (เดือนนี้)"
              value={pawn.new_customers_this_month}
              unit="คน"
            />
            <StatCard
              title="รายการที่ยังไม่ถอน"
              value={pawn.outstanding_items_count}
              unit="รายการ"
            />
            <StatCard
              title="รายการต่อดอก"
              value={pawn.interest_renewals_count}
              unit="รายการ"
            />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800">รายการที่เลยกำหนด</h3>
            <ul className="divide-y divide-gray-200 mt-2 max-h-40 overflow-y-auto">
              {pawn.overdue_items.map((item) => (
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

      {/* Customers Section */}
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
              {customers.overdue_customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-yellow-50">
                  <td className="py-2 px-4">{cust.name}</td>
                  <td className="py-2 px-4">{cust.phone}</td>
                  <td className="py-2 px-4 text-red-600 font-semibold">
                    {cust.overdue_days}
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
