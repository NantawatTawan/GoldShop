package com.maneelak.stockpawn.service;

import com.maneelak.stockpawn.dto.ReportDto;
import com.maneelak.stockpawn.entity.PawnRecord;
import com.maneelak.stockpawn.enums.PawnStatus;
import com.maneelak.stockpawn.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final PawnRecordRepository pawnRecordRepository;
    private final InterestPaymentRepository interestPaymentRepository;
    private final StockItemRepository stockItemRepository;

    private static final BigDecimal BAHT_TO_GRAMS = new BigDecimal("15.244");

    public ReportDto getFullReport() {
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.now();
        LocalDate monthStart = currentMonth.atDay(1);

        List<PawnRecord> allPawnRecords = pawnRecordRepository.findAll();

        BigDecimal pawnToday = allPawnRecords.stream()
            .filter(p -> p.getPawnDate().isEqual(today))
            .map(PawnRecord::getTotalEvaluated)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pawnThisMonth = allPawnRecords.stream()
            .filter(p -> !p.getPawnDate().isBefore(monthStart))
            .map(PawnRecord::getTotalEvaluated)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal interestThisMonth = interestPaymentRepository.findAll().stream()
            .filter(p -> !p.getPaymentDate().isBefore(monthStart))
            .map(p -> p.getAmountPaid())
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        ReportDto.IncomeExpenseSection incomeExpenseSection = ReportDto.IncomeExpenseSection.builder()
            .pawnToday(pawnToday)
            .pawnThisMonth(pawnThisMonth)
            .interestThisMonth(interestThisMonth)
            .build();

        BigDecimal totalGrams = stockItemRepository.findAll().stream()
            .map(s -> s.getWeightInGrams().multiply(new BigDecimal(s.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        ReportDto.StockSection stockSection = ReportDto.StockSection.builder()
            .totalItemCount(stockItemRepository.count())
            .totalGoldGrams(totalGrams)
            .totalGoldBaht(totalGrams.divide(BAHT_TO_GRAMS, 2, java.math.RoundingMode.HALF_UP))
            .build();

        long newCustomersToday = allPawnRecords.stream().filter(p -> p.getCustomer().getCreatedAt().toLocalDate().isEqual(today)).map(PawnRecord::getCustomer).distinct().count();
        long newCustomersThisMonth = allPawnRecords.stream().filter(p -> !p.getCustomer().getCreatedAt().toLocalDate().isBefore(monthStart)).map(PawnRecord::getCustomer).distinct().count();
        long outstandingItemsCount = allPawnRecords.stream().filter(p -> p.getStatus() == PawnStatus.ACTIVE).count();

        List<ReportDto.OverdueItem> overdueItems = allPawnRecords.stream()
            .filter(p -> p.getStatus() == PawnStatus.ACTIVE && p.getDueDate().isBefore(today))
            .map(p -> ReportDto.OverdueItem.builder()
                .id(p.getId())
                .customerName(p.getCustomer().getName())
                .pawnNumber(p.getPawnNumber())
                .dueDate(p.getDueDate().toString())
                .build())
            .collect(Collectors.toList());

        ReportDto.PawnSection pawnSection = ReportDto.PawnSection.builder()
            .newCustomersToday(newCustomersToday)
            .newCustomersThisMonth(newCustomersThisMonth)
            .outstandingItemsCount(outstandingItemsCount)
            .overdueItems(overdueItems)
            .build();


         List<ReportDto.OverdueCustomer> overdueCustomers = allPawnRecords.stream()
            .filter(p -> p.getStatus() == PawnStatus.ACTIVE && p.getDueDate().isBefore(today))
            .map(PawnRecord::getCustomer)
            .distinct()
            .map(customer -> {
                long maxOverdueDays = allPawnRecords.stream()
                    .filter(p -> p.getCustomer().equals(customer) && p.getDueDate().isBefore(today))
                    .mapToLong(p -> ChronoUnit.DAYS.between(p.getDueDate(), today))
                    .max()
                    .orElse(0);

                return ReportDto.OverdueCustomer.builder()
                    .id(customer.getId())
                    .name(customer.getName())
                    .phone(customer.getPhone())
                    .overdueDays(maxOverdueDays)
                    .build();
            })
            .collect(Collectors.toList());


        return ReportDto.builder()
            .incomeExpenses(incomeExpenseSection)
            .stock(stockSection)
            .pawn(pawnSection)
            .overdueCustomers(overdueCustomers)
            .build();
    }
}