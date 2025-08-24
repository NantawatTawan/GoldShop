import { useState, useEffect } from "react";
import axios from "axios";
import RevenueSummary from "../components/RevenueSummary";
import ActivityLog from "../components/ActivityLog";
import StockList from "../components/StockList";

import CustomerSearch from "../components/CustomerSearch";
import RevenuePieChart from "../components/Chart/RevenuePieChart";
import ActionButtons from "../components/ActionButtons";

interface PieData {
  name: string;
  value: number;
}

interface RevenueData {
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
}

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

interface Activity {
  timestamp: string;
  description: string;
  type: "income" | "expense" | "neutral";
}

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [activityLogs, setActivityLogs] = useState<Activity[]>([]);
  const [pieData, setPieData] = useState<PieData[]>([]);

  useEffect(() => {
    axios
      .get<StockItem[]>("http://localhost:8080/api/stock-items")
      .then((res) => setStockItems(res.data));

    axios
      .get("http://localhost:8080/api/dashboard/summary")
      .then((res) => {
        setRevenueData(res.data);
      })
      .catch((err) => console.error("Failed to fetch summary", err));

    axios
      .get("http://localhost:8080/api/dashboard/recent-activities")
      .then((res) => {
        setActivityLogs(res.data);
      })
      .catch((err) => console.error("Failed to fetch activities", err));

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    axios
      .get(
        `http://localhost:8080/api/dashboard/revenue-by-category?year=${year}&month=${month}`
      )
      .then((res) => {
        setPieData(res.data);
      })
      .catch((err) => console.error("Failed to fetch pie data", err));
  }, []);
  return (
    <div className="p-4 space-y-6">
      {revenueData && (
        <RevenueSummary
          data={{
            total: revenueData.totalRevenue.toLocaleString() + " บาท",
            expense: revenueData.totalExpense.toLocaleString() + " บาท",
            net: revenueData.netProfit.toLocaleString() + " บาท",
            goldSold: "N/A",
            goldBought: "N/A",
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RevenuePieChart data={pieData} />
        <StockList items={stockItems} />

        <ActivityLog logs={activityLogs} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomerSearch search={search} onSearchChange={setSearch} />
        <ActionButtons />
      </div>
    </div>
  );
}
