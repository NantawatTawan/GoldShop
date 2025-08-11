import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FormRow from "../components/FormRow";

interface Customer {
  id: number;
  name: string;
  phone: string;
  idCardData: string;
  address: string;
  createdAt: string;
}

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);

  const fetchCustomer = useCallback(async () => {
    try {
      const res = await axios.get<Customer>(
        `http://localhost:8080/api/customers/${id}`
      );
      setCustomer(res.data);
    } catch (err) {
      console.error("โหลดข้อมูลลูกค้าไม่สำเร็จ", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleSave = async () => {
    if (!editedCustomer) return;
    try {
      await axios.put(
        `http://localhost:8080/api/customers/${editedCustomer.id}`,
        editedCustomer
      );
      setCustomer(editedCustomer);
      setIsEditing(false);
    } catch (err) {
      console.error("อัปเดตไม่สำเร็จ", err);
      alert("บันทึกข้อมูลไม่สำเร็จ");
    }
  };

  useEffect(() => {
    if (id) fetchCustomer();
  }, [id, fetchCustomer]);

  if (loading) return <div className="p-6">กำลังโหลด...</div>;
  if (!customer)
    return <div className="p-6 text-red-500">ไม่พบข้อมูลลูกค้า</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-red-700">รายละเอียดลูกค้า</h1>
      <div className="bg-white rounded p-6 shadow space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormRow label="ชื่อ">
            <input
              className="w-full border px-3 py-2 rounded"
              value={isEditing ? editedCustomer?.name ?? "" : customer.name}
              onChange={(e) =>
                setEditedCustomer((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev
                )
              }
              readOnly={!isEditing}
            />
          </FormRow>
          <FormRow label="เบอร์โทร">
            <input
              className="w-full border px-3 py-2 rounded"
              value={isEditing ? editedCustomer?.phone ?? "" : customer.phone}
              onChange={(e) =>
                setEditedCustomer((prev) =>
                  prev ? { ...prev, phone: e.target.value } : prev
                )
              }
              readOnly={!isEditing}
            />
          </FormRow>
          <FormRow label="เลขบัตรประชาชน">
            <input
              className="w-full border px-3 py-2 rounded"
              value={
                isEditing
                  ? editedCustomer?.idCardData ?? ""
                  : customer.idCardData
              }
              onChange={(e) =>
                setEditedCustomer((prev) =>
                  prev ? { ...prev, idCardData: e.target.value } : prev
                )
              }
              readOnly={!isEditing}
            />
          </FormRow>
          <FormRow label="ที่อยู่">
            <input
              className="w-full border px-3 py-2 rounded"
              value={
                isEditing ? editedCustomer?.address ?? "" : customer.address
              }
              onChange={(e) =>
                setEditedCustomer((prev) =>
                  prev ? { ...prev, address: e.target.value } : prev
                )
              }
              readOnly={!isEditing}
            />
          </FormRow>
          <FormRow label="วันที่เพิ่ม">
            <input
              className="w-full border px-3 py-2 rounded"
              value={customer.createdAt.substring(0, 10)}
              readOnly
            />
          </FormRow>
        </div>
        <div className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                บันทึก
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedCustomer(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                ยกเลิก
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditedCustomer(customer);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              แก้ไข
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    </div>
  );
}
