import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function RevenuePieChart({
  selectedMonth,
  onMonthChange,
  pieDataByMonth,
}: {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  pieDataByMonth: Record<string, { name: string; value: number }[]>;
}) {
  const pieData = pieDataByMonth[selectedMonth];

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          รายรับแยกตามประเภท (ประจำเดือน)
        </h2>
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {Object.keys(pieDataByMonth).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {pieData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
