package com.maneelak.stockpawn.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "pawn_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PawnItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "pawn_record_id", nullable = false)
    private PawnRecord pawnRecord;

    @Column(name = "product_name", length = 100)
    private String productName;

    @Column(precision = 5, scale = 2)
    private BigDecimal weight;

    @Column(length = 10)
    private String unit;

    @Column(name = "evaluated_price", precision = 10, scale = 2)
    private BigDecimal evaluatedPrice;

    @Column(length = 20)
    private String status; 

    @Column(columnDefinition = "text")
    private String note;

    @Column(name = "image_url")
    private String imageUrl;
}
