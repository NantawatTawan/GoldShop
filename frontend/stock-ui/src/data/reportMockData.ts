export const reportData = {
  income_expenses: {
    pawn_today: 150000,
    pawn_this_month: 2500000,
    sales_income: 85000,
    redeem_amount: 120000,
    expected_interest_today: 5500,
    expected_interest_this_month: 75000,
  },
  stock: {
    items: [
      {
        id: 1,
        name: "สร้อยคอ 1 บาท",
        quantity: 15,
        weight_grams: 15.244,
        type: "สร้อยคอ",
      },
      {
        id: 2,
        name: "แหวน 1 สลึง",
        quantity: 45,
        weight_grams: 3.811,
        type: "แหวน",
      },
      {
        id: 3,
        name: "กำไล 2 บาท",
        quantity: 8,
        weight_grams: 30.488,
        type: "กำไล",
      },
      {
        id: 4,
        name: "ทองคำแท่ง 5 บาท",
        quantity: 5,
        weight_grams: 76.22,
        type: "ทองคำแท่ง",
      },
    ],
    total_gold_baht: 108.75, // ตัวอย่างการคำนวณ
    total_gold_grams: 1022.46, // ตัวอย่างการคำนวณ
  },
  pawn: {
    new_customers_today: 5,
    new_customers_this_month: 85,
    outstanding_items_count: 253,
    interest_renewals_count: 32,
    overdue_items: [
      {
        id: 101,
        customerName: "สมชาย ใจดี",
        pawnNumber: "PN-00123",
        dueDate: "2025-06-30",
      },
      {
        id: 102,
        customerName: "สมศรี มีสุข",
        pawnNumber: "PN-00125",
        dueDate: "2025-07-01",
      },
      {
        id: 103,
        customerName: "มานะ อดทน",
        pawnNumber: "PN-00129",
        dueDate: "2025-07-03",
      },
    ],
  },
  customers: {
    overdue_customers: [
      { id: 1, name: "สมชาย ใจดี", phone: "081-234-5678", overdue_days: 7 },
      { id: 2, name: "สมศรี มีสุข", phone: "082-345-6789", overdue_days: 6 },
      { id: 3, name: "มานะ อดทน", phone: "083-456-7890", overdue_days: 4 },
    ],
  },
};
