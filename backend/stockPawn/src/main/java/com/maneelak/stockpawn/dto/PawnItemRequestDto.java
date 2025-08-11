package com.maneelak.stockpawn.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PawnItemRequestDto {
    private String productName;
    private BigDecimal weight;
    private String unit;
    private BigDecimal evaluatedPrice;
    private String note;
    private String imageUrl;
}
