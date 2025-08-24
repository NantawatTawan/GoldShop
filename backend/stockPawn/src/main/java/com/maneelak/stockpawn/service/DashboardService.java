package com.maneelak.stockpawn.service;

import com.maneelak.stockpawn.dto.ActivityLogDto;
import com.maneelak.stockpawn.dto.DashboardSummaryDto;
import com.maneelak.stockpawn.repository.InterestPaymentRepository;
import com.maneelak.stockpawn.repository.PawnRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.maneelak.stockpawn.dto.RevenueByCategoryDto;
import java.util.Collections;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.stream.Collectors;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final InterestPaymentRepository interestPaymentRepository;
    private final PawnRecordRepository pawnRecordRepository;

    public DashboardSummaryDto getMonthlySummary() {
        YearMonth currentMonth = YearMonth.now();
        LocalDate startDate = currentMonth.atDay(1);
        LocalDate endDate = currentMonth.atEndOfMonth();

        BigDecimal totalRevenue = interestPaymentRepository.findAll().stream()
            .filter(p -> !p.getPaymentDate().isBefore(startDate) && !p.getPaymentDate().isAfter(endDate))
            .map(p -> p.getAmountPaid())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpense = pawnRecordRepository.findAll().stream()
            .filter(p -> !p.getPawnDate().isBefore(startDate) && !p.getPawnDate().isAfter(endDate))
            .map(p -> p.getTotalEvaluated())
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netProfit = totalRevenue.subtract(totalExpense);

        return DashboardSummaryDto.builder()
            .totalRevenue(totalRevenue)
            .totalExpense(totalExpense)
            .netProfit(netProfit)
            .build();
    }

    public List<ActivityLogDto> getRecentActivities() {
        Stream<ActivityLogDto> pawnActivities = pawnRecordRepository.findAll().stream()
                .map(pawn -> ActivityLogDto.builder()
                        .timestamp(pawn.getCreatedAt())
                        .description("รับจำนำ: " + pawn.getCustomer().getName() + " ยอด " + pawn.getTotalEvaluated() + " บาท")
                        .type("expense")
                        .build());
        Stream<ActivityLogDto> interestActivities = interestPaymentRepository.findAll().stream()
                .map(payment -> ActivityLogDto.builder()
                        .timestamp(payment.getCreatedAt())
                        .description("รับดอกเบี้ย: " + payment.getPawnRecord().getCustomer().getName() + " ยอด " + payment.getAmountPaid() + " บาท")
                        .type("income")
                        .build());

        return Stream.concat(pawnActivities, interestActivities)
                .sorted(Comparator.comparing(ActivityLogDto::getTimestamp).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<RevenueByCategoryDto> getRevenueByCategory(YearMonth month) {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();

        BigDecimal interestRevenue = interestPaymentRepository.findAll().stream()
            .filter(p -> !p.getPaymentDate().isBefore(startDate) && !p.getPaymentDate().isAfter(endDate))
            .map(p -> p.getAmountPaid())
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (interestRevenue.compareTo(BigDecimal.ZERO) > 0) {
            return List.of(new RevenueByCategoryDto("ดอกเบี้ยจำนำ", interestRevenue));
        }

        return Collections.emptyList();
    }
}