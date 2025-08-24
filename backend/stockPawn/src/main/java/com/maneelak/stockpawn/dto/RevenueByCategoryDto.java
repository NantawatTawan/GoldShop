package com.maneelak.stockpawn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class RevenueByCategoryDto {
    private String name;
    private BigDecimal value;
}