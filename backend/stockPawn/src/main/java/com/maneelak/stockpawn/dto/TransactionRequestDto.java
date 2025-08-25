package com.maneelak.stockpawn.dto;

import com.maneelak.stockpawn.entity.StockType; // เพิ่ม import
import com.maneelak.stockpawn.enums.TransactionType;
import lombok.Data;
import java.math.BigDecimal; // เพิ่ม import
import java.util.List;

@Data
public class TransactionRequestDto {

    private TransactionType type;
    private List<SaleItemDto> itemsToSell;
    private List<PurchaseItemDto> itemsToPurchase; // เปลี่ยนจาก StockItem เป็น DTO
    private Integer userId;

    @Data
    public static class SaleItemDto {
        private Long stockItemId;
        private int quantity;
        private BigDecimal price; // << เพิ่มฟิลด์ราคา
    }

    @Data
    public static class PurchaseItemDto { // << สร้าง DTO ใหม่สำหรับรับซื้อ
        private String itemName;
        private BigDecimal weightValue;
        private String unit;
        private Integer quantity;
        private StockType type;
        private String note;
        private BigDecimal price; // << เพิ่มฟิลด์ราคา
    }
}