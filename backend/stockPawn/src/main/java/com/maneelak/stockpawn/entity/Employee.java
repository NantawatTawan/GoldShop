package com.maneelak.stockpawn.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "full_name", length = 100, nullable = false)
    private String fullName;

    @Column(length = 20)
    private String phone;

    @Column(length = 50)
    private String position;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(precision = 10, scale = 2)
    private BigDecimal salary;

    @Column(name = "is_active")
    private Boolean isActive;
}
