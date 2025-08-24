package com.maneelak.stockpawn.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ReportDto {
    private IncomeExpenseSection incomeExpenses;
    private StockSection stock;
    private PawnSection pawn;
    private List<OverdueCustomer> overdueCustomers;

    @Data
    @Builder
    public static class IncomeExpenseSection {
        private BigDecimal pawnToday;
        private BigDecimal pawnThisMonth;
        private BigDecimal interestThisMonth;
    }

    @Data
    @Builder
    public static class StockSection {
        private long totalItemCount;
        private BigDecimal totalGoldBaht;
        private BigDecimal totalGoldGrams;
    }

    @Data
    @Builder
    public static class PawnSection {
        private long newCustomersToday;
        private long newCustomersThisMonth;
        private long outstandingItemsCount;
        private List<OverdueItem> overdueItems;
    }

    @Data
    @Builder
    public static class OverdueCustomer {
        private Integer id;
        private String name;
        private String phone;
        private long overdueDays;
    }

    @Data
    @Builder
    public static class OverdueItem {
         private Integer id;
         private String customerName;
         private String pawnNumber;
         private String dueDate;
    }
}