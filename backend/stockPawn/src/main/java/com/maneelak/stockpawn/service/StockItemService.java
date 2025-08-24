package com.maneelak.stockpawn.service;

import com.maneelak.stockpawn.entity.StockItem;
import com.maneelak.stockpawn.entity.StockType;
import com.maneelak.stockpawn.repository.StockItemRepository;
import com.maneelak.stockpawn.repository.StockTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;
import java.math.RoundingMode;


@Service
@RequiredArgsConstructor

public class StockItemService {

    private final StockItemRepository stockItemRepository;
    private final StockTypeRepository stockTypeRepository;
    private static final BigDecimal BAHT_TO_GRAMS = new BigDecimal("15.244");

    public List<StockItem> getAllItems(Sort sort) {
        return stockItemRepository.findAll(sort);
    }

    private void calculateAndSetWeightInGrams(StockItem item) {
        if (item.getWeightValue() == null || item.getUnit() == null) {
            item.setWeightInGrams(BigDecimal.ZERO);
            return;
        }

        if ("บาท".equalsIgnoreCase(item.getUnit())) {
            item.setWeightInGrams(item.getWeightValue().multiply(BAHT_TO_GRAMS).setScale(3, RoundingMode.HALF_UP));
        } else if ("กรัม".equalsIgnoreCase(item.getUnit())) {
            item.setWeightInGrams(item.getWeightValue().setScale(3, RoundingMode.HALF_UP));
        } else {
            item.setWeightInGrams(BigDecimal.ZERO);
        }
    }

    public StockItem getItemById(Long id) {
        return stockItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stock item not found"));
    }

    public StockItem createItem(StockItem item) {
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());

        calculateAndSetWeightInGrams(item);

        StockType type = stockTypeRepository.findById(item.getType().getId())
                .orElseThrow(() -> new EntityNotFoundException("Invalid stock type"));
        item.setType(type);
        return stockItemRepository.save(item);
    }

    public StockItem updateItem(Long id, StockItem updatedItem) {
        StockItem existing = stockItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stock item not found"));

        existing.setItemName(updatedItem.getItemName());
        existing.setWeightValue(updatedItem.getWeightValue());
        existing.setUnit(updatedItem.getUnit());
        existing.setQuantity(updatedItem.getQuantity());
        existing.setNote(updatedItem.getNote());
        existing.setUpdatedAt(LocalDateTime.now());

        calculateAndSetWeightInGrams(existing);

        StockType type = stockTypeRepository.findById(updatedItem.getType().getId())
                .orElseThrow(() -> new EntityNotFoundException("Invalid stock type"));
        existing.setType(type);

        return stockItemRepository.save(existing);
    }

    @Transactional
    public void deleteItem(Long id) {
        if (!stockItemRepository.existsById(id)) {
            throw new EntityNotFoundException("Stock item not found");
        }
        stockItemRepository.deleteById(id);
        
    }
}
