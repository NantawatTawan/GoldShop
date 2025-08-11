import { useState, useEffect } from "react";
import axios from "axios";
import RevenueSummary from "../components/RevenueSummary";
import ActivityLog from "../components/ActivityLog";
import StockList from "../components/StockList";

import CustomerSearch from "../components/CustomerSearch";
import RevenuePieChart from "../components/Chart/RevenuePieChart";
import ActionButtons from "../components/ActionButtons";
import {
  mockRevenue,
  mockActivityLogs,
  pieDataByMonth,
} from "../data/mockData";

interface StockItem {
  id: number;
  itemName: string;
  weightValue: number;
  unit: string;
  quantity: number;
  type: {
    id: number;
    name: string;
  };
}

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("พฤษภาคม");
  const [stockItems, setStockItems] = useState<StockItem[]>([]);

  useEffect(() => {
    axios
      .get<StockItem[]>("http://localhost:8080/api/stock-items")
      .then((res) => setStockItems(res.data));
  }, []);
  return (
    <div className="p-4 space-y-6">
      <RevenueSummary data={mockRevenue} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RevenuePieChart
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          pieDataByMonth={pieDataByMonth}
        />
        <StockList items={stockItems} />

        <ActivityLog logs={mockActivityLogs} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomerSearch search={search} onSearchChange={setSearch} />
        <ActionButtons />
      </div>
    </div>
  );
}
