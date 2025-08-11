import { useEffect, useState } from "react";
import axios from "axios";
import CustomerListTable from "../components/customer/CustomerListTable";
import AddCustomerModal from "../components/customer/AddCustomerModal";

export interface Customer {
  id: number;
  name: string;
  phone: string;
}

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Customer[]>(
        "http://localhost:8080/api/customers"
      );
      setCustomers(res.data);
    } catch (err) {
      console.error("โหลดข้อมูลลูกค้าล้มเหลว", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบลูกค้ารายนี้?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error("ลบลูกค้าไม่สำเร็จ", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      c.phone.includes(searchKeyword)
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-red-700">รายการลูกค้า</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ เพิ่มลูกค้า
        </button>
      </div>

      <input
        type="text"
        placeholder="ค้นหาชื่อลูกค้าหรือเบอร์โทร"
        className="border px-3 py-2 rounded w-72"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />

      {loading ? (
        <div className="text-gray-400">กำลังโหลดข้อมูล...</div>
      ) : (
        <CustomerListTable
          customers={filteredCustomers}
          onDelete={handleDelete}
        />
      )}

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCustomerAdded={fetchCustomers}
      />
    </div>
  );
}
