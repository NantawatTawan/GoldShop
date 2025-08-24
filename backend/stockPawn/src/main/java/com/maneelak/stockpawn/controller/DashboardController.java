package com.maneelak.stockpawn.controller;

import com.maneelak.stockpawn.dto.DashboardSummaryDto;
import com.maneelak.stockpawn.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.maneelak.stockpawn.dto.ActivityLogDto;
import java.util.List;
import com.maneelak.stockpawn.dto.RevenueByCategoryDto;
import java.time.YearMonth;



@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDto> getSummary() {
        return ResponseEntity.ok(dashboardService.getMonthlySummary());
    }

    @GetMapping("/recent-activities")
    public ResponseEntity<List<ActivityLogDto>> getRecentActivities() {
        return ResponseEntity.ok(dashboardService.getRecentActivities());
    }

    @GetMapping("/revenue-by-category")
    public ResponseEntity<List<RevenueByCategoryDto>> getRevenueByCategory(
            @RequestParam int year,
            @RequestParam int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        return ResponseEntity.ok(dashboardService.getRevenueByCategory(yearMonth));
    }
}