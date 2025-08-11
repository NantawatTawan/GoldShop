package com.maneelak.stockpawn.repository;

import com.maneelak.stockpawn.entity.StockItem;
import com.maneelak.stockpawn.entity.StockType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockItemRepository extends JpaRepository<StockItem, Long> {


    List<StockItem> findByItemNameContainingIgnoreCase(String keyword);


    List<StockItem> findByType(StockType type);


    List<StockItem> findByWeightValueBetween(Double min, Double max);


    List<StockItem> findByQuantityLessThan(Integer quantityThreshold);
}
