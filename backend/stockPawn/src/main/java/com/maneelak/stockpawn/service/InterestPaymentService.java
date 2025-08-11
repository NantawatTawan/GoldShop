package com.maneelak.stockpawn.service;

import com.maneelak.stockpawn.dto.InterestPaymentRequestDto;
import com.maneelak.stockpawn.dto.InterestPaymentResponseDto;
import com.maneelak.stockpawn.entity.*;
import com.maneelak.stockpawn.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterestPaymentService {

    private final InterestPaymentRepository interestPaymentRepository;
    private final PawnRecordRepository pawnRecordRepository;
    private final UserRepository userRepository;

    public InterestPaymentResponseDto createInterestPayment(InterestPaymentRequestDto dto) {
        PawnRecord pawn = pawnRecordRepository.findById(dto.getPawnRecordId())
                .orElseThrow(() -> new RuntimeException("Pawn record not found"));
        User user = userRepository.findById(dto.getReceivedByUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        BigDecimal expectedAmount = pawn.getTotalEvaluated()
                .multiply(pawn.getInterestRate())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(dto.getPeriodCountPaid() != null ? dto.getPeriodCountPaid() : 1));

        BigDecimal amountPaid = dto.getAmountPaid();
        BigDecimal remainingAmount = expectedAmount.subtract(amountPaid).max(BigDecimal.ZERO);

        InterestPayment payment = InterestPayment.builder()
                .pawnRecord(pawn)
                .periodStart(dto.getPeriodStart())
                .periodEnd(dto.getPeriodEnd())
                .expectedAmount(expectedAmount)
                .amountPaid(amountPaid)
                .remainingAmount(remainingAmount)
                .paymentNumber(dto.getPaymentNumber())
                .paymentDate(dto.getPaymentDate())
                .receivedBy(user)
                .note(dto.getNote())
                .periodCountPaid(dto.getPeriodCountPaid())  
                .build();

       
        if (dto.getPeriodCountPaid() != null && dto.getPeriodCountPaid() > 0) {
            pawn.setDueDate(pawn.getDueDate().plusMonths(dto.getPeriodCountPaid()));
            pawnRecordRepository.save(pawn);
        }

        payment = interestPaymentRepository.save(payment);
        return toResponseDto(payment);
    }

    public List<InterestPaymentResponseDto> getByPawnRecordId(Integer pawnRecordId) {
        return interestPaymentRepository.findByPawnRecordId(pawnRecordId).stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    private InterestPaymentResponseDto toResponseDto(InterestPayment payment) {
        return InterestPaymentResponseDto.builder()
                .id(payment.getId())
                .pawnRecordId(payment.getPawnRecord().getId())
                .periodStart(payment.getPeriodStart())
                .periodEnd(payment.getPeriodEnd())
                .expectedAmount(payment.getExpectedAmount())
                .amountPaid(payment.getAmountPaid())
                .remainingAmount(payment.getRemainingAmount())
                .paymentNumber(payment.getPaymentNumber())
                .paymentDate(payment.getPaymentDate())
                .receivedByUsername(payment.getReceivedBy().getUsername())
                .note(payment.getNote())
                .periodCountPaid(payment.getPeriodCountPaid()) 
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
