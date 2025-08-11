package com.maneelak.stockpawn.service;

import com.maneelak.stockpawn.entity.StockItem;
import com.maneelak.stockpawn.entity.StockType;
import com.maneelak.stockpawn.repository.StockItemRepository;
import com.maneelak.stockpawn.repository.StockTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor

public class StockItemService {

    private final StockItemRepository stockItemRepository;
    private final StockTypeRepository stockTypeRepository;

    //ดึงสินค้าทั้งหมด
    public List<StockItem> getAllItems() {
        return stockItemRepository.findAll();
    }

    //ดึงสินค้าตาม id
    public StockItem getItemById(Long id) {
        return stockItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stock item not found"));
    }

    //เพิ่มสินค้าใหม่
    public StockItem createItem(StockItem item) {
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());

        //ตรวจสอบ type 
        StockType type = stockTypeRepository.findById(item.getType().getId())
                .orElseThrow(() -> new EntityNotFoundException("Invalid stock type"));

        item.setType(type);
        return stockItemRepository.save(item);
    }

    //แก้ไขสินค้า
    public StockItem updateItem(Long id, StockItem updatedItem) {
        StockItem existing = stockItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stock item not found"));

        existing.setItemName(updatedItem.getItemName());
        existing.setWeightValue(updatedItem.getWeightValue());
        existing.setUnit(updatedItem.getUnit());
        existing.setQuantity(updatedItem.getQuantity());
        existing.setNote(updatedItem.getNote());
        existing.setUpdatedAt(LocalDateTime.now());

        //ตรวจสอบและอัปเดตประเภท
        StockType type = stockTypeRepository.findById(updatedItem.getType().getId())
                .orElseThrow(() -> new EntityNotFoundException("Invalid stock type"));

        existing.setType(type);

        return stockItemRepository.save(existing);
    }

    //ลบสินค้า
    @Transactional
    public void deleteItem(Long id) {
        if (!stockItemRepository.existsById(id)) {
            throw new EntityNotFoundException("Stock item not found");
        }
        stockItemRepository.deleteById(id);
        
    }
}
