interface RevenueData {
  total: string;
  expense: string;
  net: string;
  goldSold: string;
  goldBought: string;
}

export default function RevenueSummary({ data }: { data: RevenueData }) {
  return (
    <div className="bg-white p-4 rounded shadow w-full">
      <h2 className="text-xl font-semibold mb-4">ยอดรวมประจำเดือน</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Box color="green" title="รายรับรวม" value={data.total} />
        <Box color="red" title="รายจ่ายรวม" value={data.expense} />
        <Box color="blue" title="กำไรสุทธิ" value={data.net} />
        <Box color="yellow" title="ทองขายออกทั้งหมด" value={data.goldSold} />
        <Box
          color="purple"
          title="ทองรับซื้อเข้ามาทั้งหมด"
          value={data.goldBought}
        />
      </div>
    </div>
  );
}

function Box({
  color,
  title,
  value,
}: {
  color: string;
  title: string;
  value: string;
}) {
  return (
    <div
      className={`bg-${color}-50 border-l-4 border-${color}-500 p-3 rounded`}
    >
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-lg font-bold text-${color}-700`}>{value}</div>
    </div>
  );
}
