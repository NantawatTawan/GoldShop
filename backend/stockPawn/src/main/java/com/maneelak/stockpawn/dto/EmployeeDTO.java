package com.maneelak.stockpawn.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDTO {
    private Integer id;
    private String fullName;
    private String phone;
    private String position;
    private LocalDate startDate;
    private BigDecimal salary;
    private Boolean isActive;
}
