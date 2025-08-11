package com.maneelak.stockpawn.repository;

import com.maneelak.stockpawn.entity.PawnItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PawnItemRepository extends JpaRepository<PawnItem, Integer> {
    List<PawnItem> findByPawnRecordId(Integer pawnRecordId);
}
