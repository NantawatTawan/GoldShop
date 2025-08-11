package com.maneelak.stockpawn.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterestPaymentResponseDto {
    private Integer id;
    private Integer pawnRecordId;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal expectedAmount;
    private BigDecimal amountPaid;
    private BigDecimal remainingAmount;
    private Integer paymentNumber;
    private LocalDate paymentDate;
    private String receivedByUsername;
    private String note;
    private LocalDateTime createdAt;
    private Integer periodCountPaid;

}
