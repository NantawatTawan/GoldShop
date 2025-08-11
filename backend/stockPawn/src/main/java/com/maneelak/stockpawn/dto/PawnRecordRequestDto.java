package com.maneelak.stockpawn.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PawnRecordRequestDto {
    private Integer customerId;
    private Integer createdByUserId;
    private LocalDate pawnDate;
    private LocalDate dueDate;
    private Integer interestPeriodMonths;
    private BigDecimal interestRate;
    private BigDecimal totalEvaluated;
    private List<PawnItemRequestDto> items;
}
