package com.maneelak.stockpawn.repository;

import com.maneelak.stockpawn.entity.InterestPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterestPaymentRepository extends JpaRepository<InterestPayment, Integer> {
    List<InterestPayment> findByPawnRecordId(Integer pawnRecordId);
    List<InterestPayment> findByReceivedById(Integer userId);
}
