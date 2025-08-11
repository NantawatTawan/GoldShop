package com.maneelak.stockpawn.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_items")
@Data
public class StockItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name", length = 50, nullable = false)
    private String itemName;

    @Column(name = "weight_value", precision = 5, scale = 2, nullable = false)
    private BigDecimal weightValue;

    @Column(length = 10)
    private String unit;

    private Integer quantity;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private StockType type;
}
