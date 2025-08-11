export const mockRevenue = {
  total: "999,999 บาท",
  expense: "123,456 บาท",
  net: "876,543 บาท",
  goldSold: "999 บาททอง",
  goldBought: "888 บาททอง",
};

export const mockActivityLogs = [
  {
    date: "20 พ.ค.",
    time: "14:30",
    description: "ขายสร้อยทอง 1 บาท ราคา 50,000 บาท",
    type: "income",
  },
  {
    date: "20 พ.ค.",
    time: "10:15",
    description: "ซื้อกำไลทองเข้าร้าน 2 เส้น 20,000 บาท",
    type: "expense",
  },
  {
    date: "19 พ.ค.",
    time: "17:50",
    description: "รับดอกเบี้ยจำนำจากลูกค้า 1,200 บาท",
    type: "income",
  },
  {
    date: "19 พ.ค.",
    time: "11:20",
    description: "ถอนทองแหวน 1 สลึง คืนให้ลูกค้า",
    type: "expense",
  },
  {
    date: "18 พ.ค.",
    time: "09:40",
    description: "ขายแหวนทอง 2 วง ราคา 25,000 บาท",
    type: "income",
  },
  {
    date: "17 พ.ค.",
    time: "13:00",
    description: "เปิดบัญชีออมทองใหม่ให้ลูกค้า",
    type: "neutral",
  },
  {
    date: "16 พ.ค.",
    time: "16:30",
    description: "ซื้อสร้อยคอทองคำเข้าร้าน 1 บาท 28,000 บาท",
    type: "expense",
  },
  {
    date: "16 พ.ค.",
    time: "10:10",
    description: "ถอนบัญชีออมทองของลูกค้า 1 ราย",
    type: "expense",
  },
  {
    date: "15 พ.ค.",
    time: "14:00",
    description: "รับซื้อทองคำแท่ง 5 บาท 150,000 บาท",
    type: "expense",
  },
  {
    date: "14 พ.ค.",
    time: "15:15",
    description: "ขายกำไลทอง 2 วง ราคา 45,000 บาท",
    type: "income",
  },
] as const;

export const mockStock = [
  { name: "สร้อยคอ 1 บาท", quantity: 20 },
  { name: "แหวน 1 สลึง", quantity: 35 },
  { name: "กำไล 2 บาท", quantity: 10 },
  { name: "สร้อยข้อมือ 1 บาท", quantity: 12 },
];

export const pieDataByMonth: Record<string, { name: string; value: number }[]> =
  {
    พฤษภาคม: [
      { name: "ขายทอง", value: 50000 },
      { name: "ดอกเบี้ยจำนำ", value: 12000 },
      { name: "ออมทอง", value: 8000 },
      { name: "ค่าบริการอื่น ๆ", value: 3000 },
    ],
    เมษายน: [
      { name: "ขายทอง", value: 42000 },
      { name: "ดอกเบี้ยจำนำ", value: 15000 },
      { name: "ออมทอง", value: 5000 },
      { name: "ค่าบริการอื่น ๆ", value: 4000 },
    ],
    มีนาคม: [
      { name: "ขายทอง", value: 60000 },
      { name: "ดอกเบี้ยจำนำ", value: 9000 },
      { name: "ออมทอง", value: 11000 },
      { name: "ค่าบริการอื่น ๆ", value: 2000 },
    ],
  };
