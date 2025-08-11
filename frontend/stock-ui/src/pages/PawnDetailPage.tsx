import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import RedeemConfirmModal from "../components/pawn/RedeemConfirmModal";
import InterestPaymentModal from "../components/pawn/InterestPaymentModal";
import dayjs from "dayjs";
import { formatDateThaiFull } from "../components/ui/FormatDate";

interface PawnItem {
  productName: string;
  note: string;
}

interface PawnDetail {
  id: number;
  pawnNumber: string;
  customerName: string;
  pawnDate: string;
  dueDate: string;
  interestPeriodMonths: number;
  interestRate: number;
  totalEvaluated: number;
  status: string;
  items: PawnItem[];
}

export default function PawnDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pawn, setPawn] = useState<PawnDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [previousRemaining, setPreviousRemaining] = useState(0);
  const [interestStatus, setInterestStatus] = useState("");
  const [daysUntilDue, setDaysUntilDue] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/pawns/${id}`)
      .then((res) => setPawn(res.data))
      .catch((err) => console.error("โหลดข้อมูลจำนำล้มเหลว", err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!pawn) return;

    axios
      .get(`http://localhost:8080/api/interest-payments/pawn/${id}`)
      .then((res) => {
        const list = res.data;
        if (list.length > 0) {
          const last = list[list.length - 1];
          if (last.remainingAmount > 0) {
            setInterestStatus("⚠️ ค้างชำระบางส่วน");
            setPreviousRemaining(last.remainingAmount);
          } else {
            setInterestStatus("✅ ชำระครบแล้ว");
          }
          const due = dayjs(last.periodEnd);
          const now = dayjs();
          setDaysUntilDue(due.diff(now, "day"));
        } else {
          setInterestStatus("⏰ ยังไม่เคยชำระดอกเบี้ย");
          setDaysUntilDue(dayjs(pawn.dueDate).diff(dayjs(), "day"));
        }
      })
      .catch((err) => console.error("โหลดข้อมูลยอดค้างล้มเหลว", err));
  }, [pawn, id]);

  const translateStatus = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "ยังไม่ถอน";
      case "REDEEMED":
        return "ไถ่ถอนแล้ว";
      case "EXPIRED":
        return "หมดอายุ";
      default:
        return status;
    }
  };

  const handleSubmitInterest = async (
    amountPaid: number,
    periodCountPaid: number
  ) => {
    if (!pawn) return;
    const currentUserId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
    const currentPeriodStart = pawn.dueDate;

    try {
      await axios.post("http://localhost:8080/api/interest-payments", {
        pawnRecordId: pawn.id,
        periodStart: currentPeriodStart,
        periodEnd: dayjs(currentPeriodStart)
          .add(periodCountPaid * pawn.interestPeriodMonths, "month")
          .format("YYYY-MM-DD"),
        amountPaid,
        paymentNumber: 0,
        paymentDate: new Date().toISOString(),
        receivedByUserId: currentUserId,
        note: "",
        periodCountPaid,
      });
      alert("บันทึกการจ่ายดอกเบี้ยเรียบร้อยแล้ว");
      setShowInterestModal(false);
      const updated = await axios.get(
        `http://localhost:8080/api/pawns/${pawn.id}`
      );
      setPawn(updated.data);
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึก");
      console.error(error);
    }
  };

  if (loading) return <div className="p-6">กำลังโหลด...</div>;
  if (!pawn) return <div className="p-6 text-red-600">ไม่พบข้อมูล</div>;

  const isActive = pawn.status === "ACTIVE";
  const interestPerPeriod = (pawn.totalEvaluated * pawn.interestRate) / 100;

  return (
    <div className="p-6 space-y-6 max-w-4xl ">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        ← กลับ
      </button>

      <section>
        <h1 className="text-2xl font-bold text-yellow-700 mb-1">
          รายละเอียดรายการจำนำ
        </h1>
        <p className="text-sm text-gray-500">เลขที่ใบจำนำ: {pawn.pawnNumber}</p>
      </section>

      <div className="bg-white rounded-lg border border-yellow-300 p-6 shadow">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <div className="text-gray-500">ลูกค้า</div>
            <div className="font-medium">{pawn.customerName}</div>
          </div>
          <div>
            <div className="text-gray-500">สถานะ</div>
            <div className="font-medium">{translateStatus(pawn.status)}</div>
          </div>
          <div>
            <div className="text-gray-500">วันที่จำนำ</div>
            <div>{formatDateThaiFull(pawn.pawnDate)}</div>
          </div>
          <div>
            <div className="text-gray-500">ครบกำหนด</div>
            <div>{formatDateThaiFull(pawn.dueDate)}</div>
          </div>
          <div>
            <div className="text-gray-500">งวดดอกเบี้ย</div>
            <div>ทุก {pawn.interestPeriodMonths} เดือน</div>
          </div>
          <div>
            <div className="text-gray-500">ดอกเบี้ย</div>
            <div>{pawn.interestRate}%</div>
          </div>
          <div className="col-span-2">
            <div className="text-gray-500">ยอดตีราคา</div>
            <div className="text-xl font-semibold text-red-700">
              {pawn.totalEvaluated.toLocaleString()} บาท
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-gray-500">ยอดดอกเบี้ย (ต่อรอบ)</div>
            <div className="text-xl font-bold text-green-700">
              {interestPerPeriod.toLocaleString()} บาท
            </div>
          </div>
          {isActive && (
            <>
              <div className="col-span-2">
                <div className="text-gray-500">สถานะดอกเบี้ย</div>
                <div className="font-medium">{interestStatus}</div>
              </div>
              {daysUntilDue !== null && (
                <div className="col-span-2">
                  <div className="text-gray-500">กำหนดจ่ายดอกเบี้ยรอบถัดไป</div>
                  <div className="text-blue-700 font-medium">
                    {daysUntilDue >= 0
                      ? `อีก ${daysUntilDue} วัน`
                      : `เลยกำหนดแล้ว ${Math.abs(daysUntilDue)} วัน`}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-yellow-700 mb-2">
          สินค้าในรายการนี้
        </h2>
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-yellow-100">
            <tr>
              <th className="text-left px-4 py-2 w-12">#</th>
              <th className="text-left px-4 py-2">ชื่อสินค้า</th>
              <th className="text-left px-4 py-2">หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {pawn.items.map((item, idx) => (
              <tr key={idx} className="hover:bg-yellow-50">
                <td className="px-4 py-2 border-t text-gray-500">{idx + 1}</td>
                <td className="px-4 py-2 border-t">{item.productName}</td>
                <td className="px-4 py-2 border-t">{item.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isActive && (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowRedeemModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ✅ ไถ่ถอน
          </button>
          <button
            onClick={() => setShowInterestModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            💸 จ่ายดอกเบี้ย
          </button>
        </div>
      )}

      {isActive && (
        <>
          <RedeemConfirmModal
            isOpen={showRedeemModal}
            onClose={() => setShowRedeemModal(false)}
            pawnNumber={pawn.pawnNumber}
            totalEvaluated={pawn.totalEvaluated}
            items={pawn.items}
            onConfirm={() => {
              axios
                .patch(`http://localhost:8080/api/pawns/${pawn.id}/redeem`)
                .then(() => {
                  alert("ไถ่ถอนสำเร็จ");
                  navigate("/pawn");
                });
            }}
          />

          <InterestPaymentModal
            isOpen={showInterestModal}
            onClose={() => setShowInterestModal(false)}
            totalEvaluated={pawn.totalEvaluated}
            interestRate={pawn.interestRate}
            interestPeriodMonths={pawn.interestPeriodMonths}
            onConfirm={handleSubmitInterest}
            previousRemainingAmount={previousRemaining}
          />
        </>
      )}
    </div>
  );
}
