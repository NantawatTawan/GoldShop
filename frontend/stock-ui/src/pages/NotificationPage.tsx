import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  linkTo: string;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/notifications")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Failed to fetch notifications", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-700 mb-4">การแจ้งเตือน</h1>
      {loading ? (
        <p>กำลังโหลด...</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((noti) => (
            <li
              key={noti.id}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-yellow-50"
              onClick={() => navigate(noti.linkTo)}
            >
              <p className="font-semibold">{noti.message}</p>
              <p className="text-sm text-gray-500">
                {new Date(noti.createdAt).toLocaleString("th-TH")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
