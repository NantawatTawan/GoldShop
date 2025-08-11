package com.maneelak.stockpawn.repository;

import com.maneelak.stockpawn.entity.StockType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockTypeRepository extends JpaRepository<StockType, Integer> {

    StockType findByName(String name);
}
