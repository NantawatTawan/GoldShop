import DataTable from "../ui/DataTable";
import type { PawnRecord } from "../../pages/PawnPage";

interface Props {
  pawnRecords: PawnRecord[];
  onRowClick?: (id: number) => void;
}

export default function PawnTable({ pawnRecords, onRowClick }: Props) {
  return (
    <DataTable
      data={pawnRecords}
      onRowClick={(item) => onRowClick?.(item.id)}
      columns={[
        {
          header: "เลขจำนำ",
          render: (item) => item.pawnNumber,
        },
        {
          header: "ชื่อลูกค้า",
          render: (item) => item.customerName,
        },
        {
          header: "วันที่จำนำ",
          render: (item) => new Date(item.pawnDate).toLocaleDateString("th-TH"),
        },
        {
          header: "ครบกำหนด",
          render: (item) => new Date(item.dueDate).toLocaleDateString("th-TH"),
        },
        {
          header: "ดอกเบี้ย (%)",
          render: (item) => item.interestRate.toFixed(2),
        },
        {
          header: "ยอดตีราคา",
          render: (item) => item.totalEvaluated.toLocaleString(),
        },
        {
          header: "สถานะ",
          render: (item) => item.status,
        },
      ]}
    />
  );
}
