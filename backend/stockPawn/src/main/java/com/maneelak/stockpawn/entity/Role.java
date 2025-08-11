package com.maneelak.stockpawn.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "userroles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 255, nullable = false, unique = true)
    private String name; 
}
