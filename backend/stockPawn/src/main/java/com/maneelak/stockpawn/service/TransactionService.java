package com.maneelak.stockpawn.service;

import com.maneelak.stockpawn.dto.TransactionRequestDto;
import com.maneelak.stockpawn.entity.StockItem;
import com.maneelak.stockpawn.repository.StockItemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final StockItemRepository stockItemRepository;
    private final StockItemService stockItemService; // เราจะใช้ Service เดิมเพื่อช่วยสร้างของใหม่

    // TODO: ในอนาคตจะ Inject ActivityLogService ที่นี่

    @Transactional // ทำให้ถ้ามีส่วนไหนผิดพลาด การทำงานทั้งหมดจะถูกยกเลิก (Rollback)
    public void performTransaction(TransactionRequestDto request) {

        switch (request.getType()) {
            case SALE:
                handleSale(request);
                break;
            case PURCHASE:
                handlePurchase(request);
                break;
            case EXCHANGE:
                // การเปลี่ยน คือการขายและการซื้อพร้อมกัน
                handleSale(request);
                handlePurchase(request);
                break;
            default:
                throw new IllegalArgumentException("Invalid transaction type");
        }
        
        // TODO: บันทึก ActivityLog หลังจากทำรายการสำเร็จ
    }

    private void handleSale(TransactionRequestDto request) {
        if (request.getItemsToSell() == null || request.getItemsToSell().isEmpty()) {
            // ในกรณี Exchange อาจจะไม่มีการขาย
            return; 
        }

        for (TransactionRequestDto.SaleItemDto itemDto : request.getItemsToSell()) {
            StockItem item = stockItemRepository.findById(itemDto.getStockItemId())
                    .orElseThrow(() -> new EntityNotFoundException("Stock item not found: " + itemDto.getStockItemId()));

            if (item.getQuantity() < itemDto.getQuantity()) {
                throw new IllegalArgumentException("Not enough stock for item: " + item.getItemName());
            }

            item.setQuantity(item.getQuantity() - itemDto.getQuantity());
            stockItemRepository.save(item);
        }
    }

    private void handlePurchase(TransactionRequestDto request) {
        if (request.getItemsToPurchase() == null || request.getItemsToPurchase().isEmpty()) {
             // ในกรณี Exchange อาจจะไม่มีการซื้อ
            return;
        }

        for (StockItem newItem : request.getItemsToPurchase()) {
             // ถ้าเป็นของเปลี่ยน ให้เพิ่มหมายเหตุ
            if (request.getType() == com.maneelak.stockpawn.enums.TransactionType.EXCHANGE) {
                String originalNote = newItem.getNote() != null ? newItem.getNote() : "";
                newItem.setNote("เปลี่ยนจาก: [ระบุสินค้าเดิม] " + originalNote);
            }
            // ใช้ createItem จาก Service เดิมที่เรามีอยู่แล้ว
            stockItemService.createItem(newItem);
        }
    }
}