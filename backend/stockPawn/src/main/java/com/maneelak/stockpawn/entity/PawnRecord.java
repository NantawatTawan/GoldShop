package com.maneelak.stockpawn.entity;

import com.maneelak.stockpawn.enums.PawnStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pawn_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PawnRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "pawn_number", length = 50, nullable = false, unique = true)
    private String pawnNumber;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdBy;

    @Column(name = "pawn_date", nullable = false)
    private LocalDate pawnDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "interest_rate", precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(name = "total_evaluated", precision = 12, scale = 2)
    private BigDecimal totalEvaluated;

    @Column(name = "interest_period_months")
    private Integer interestPeriodMonths;   

    @Column(name = "redeemed_date")
    private LocalDate redeemedDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private PawnStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.status == null) {
            this.status = PawnStatus.ACTIVE;
        }
    }
}
