package com.maneelak.stockpawn.controller;

import com.maneelak.stockpawn.dto.ReportDto;
import com.maneelak.stockpawn.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/full")
    public ResponseEntity<ReportDto> getFullReport() {
        return ResponseEntity.ok(reportService.getFullReport());
    }
}