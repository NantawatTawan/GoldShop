package com.maneelak.stockpawn.repository;

import com.maneelak.stockpawn.entity.PawnRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PawnRecordRepository extends JpaRepository<PawnRecord, Integer> {
    List<PawnRecord> findByCustomerId(Integer customerId);
    PawnRecord findByPawnNumber(String pawnNumber);
}
