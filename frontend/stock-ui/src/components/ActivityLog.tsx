interface Activity {
  timestamp: string;
  description: string;
  type: "income" | "expense" | "neutral";
}

export default function ActivityLog({ logs }: { logs: readonly Activity[] }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">รายการเคลื่อนไหวล่าสุด</h2>
      <div className="overflow-y-auto max-h-64">
        <ul className="divide-y divide-gray-200">
          {logs.map((log, index) => {
            const color =
              log.type === "income"
                ? "text-green-600"
                : log.type === "expense"
                ? "text-red-600"
                : "text-gray-800";
            const dateObj = new Date(log.timestamp);
            const date = dateObj.toLocaleDateString("th-TH", {
              day: "numeric",
              month: "short",
            });
            const time = dateObj.toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <li key={index} className="py-2">
                <div className="text-sm text-gray-500">
                  {date} เวลา {time} น.
                </div>
                <div className={`text-base font-medium ${color}`}>
                  {log.description}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
