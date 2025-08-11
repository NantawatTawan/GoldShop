package com.maneelak.stockpawn.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PawnRecordResponseDto {
    private Integer id;
    private String pawnNumber;
    private String customerName;
    private LocalDate pawnDate;
    private LocalDate dueDate;
    private Integer interestPeriodMonths;
    private BigDecimal interestRate;
    private BigDecimal totalEvaluated;
    private String status;
    private List<PawnItemRequestDto> items;
}
