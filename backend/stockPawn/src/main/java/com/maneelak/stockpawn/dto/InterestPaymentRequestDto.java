package com.maneelak.stockpawn.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterestPaymentRequestDto {
    private Integer pawnRecordId;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal amountPaid;
    private Integer periodCountPaid;
    private Integer paymentNumber;
    private LocalDate paymentDate;
    private Integer receivedByUserId;
    private String note;
    
}
