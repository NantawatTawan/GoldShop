import { useEffect, useState } from "react";
import axios from "axios";
import AddPawnModal from "../components/pawn/AddPawnModal";
import PawnTable from "../components/pawn/PawnTable";
import { useNavigate } from "react-router-dom";

export interface PawnRecord {
  id: number;
  pawnNumber: string;
  customerName: string;
  pawnDate: string;
  dueDate: string;
  interestRate: number;
  totalEvaluated: number;
  status: string;
}

export default function PawnPage() {
  const [pawnRecords, setPawnRecords] = useState<PawnRecord[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPawnRecords = async () => {
    try {
      setLoading(true);
      const res = await axios.get<PawnRecord[]>(
        "http://localhost:8080/api/pawns"
      );
      setPawnRecords(res.data);
    } catch (err) {
      console.error("โหลดข้อมูลรายการจำนำล้มเหลว", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPawnRecords();
  }, []);

  const filteredRecords = pawnRecords.filter(
    (r) =>
      r.customerName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      r.pawnNumber.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-red-700">รายการจำนำ</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ เพิ่มรายการจำนำ
        </button>
      </div>

      <input
        type="text"
        placeholder="ค้นหาชื่อลูกค้าหรือเลขจำนำ"
        className="border px-3 py-2 rounded w-72"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />

      {loading ? (
        <div className="text-gray-400">กำลังโหลดข้อมูล...</div>
      ) : (
        <PawnTable
          pawnRecords={filteredRecords}
          onRowClick={(id) => navigate(`/pawn/${id}`)}
        />
      )}

      <AddPawnModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPawnAdded={fetchPawnRecords}
      />
    </div>
  );
}
