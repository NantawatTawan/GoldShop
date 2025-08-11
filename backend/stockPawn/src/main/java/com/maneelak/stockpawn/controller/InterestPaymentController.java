package com.maneelak.stockpawn.controller;

import com.maneelak.stockpawn.dto.InterestPaymentRequestDto;
import com.maneelak.stockpawn.dto.InterestPaymentResponseDto;
import com.maneelak.stockpawn.service.InterestPaymentService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interest-payments")
@RequiredArgsConstructor
public class InterestPaymentController {

    private final InterestPaymentService interestPaymentService;

    @PostMapping
    public ResponseEntity<InterestPaymentResponseDto> createPayment(
            @RequestBody InterestPaymentRequestDto request) {
        return ResponseEntity.ok(interestPaymentService.createInterestPayment(request));
    }

    @GetMapping("/pawn/{pawnRecordId}")
    public ResponseEntity<List<InterestPaymentResponseDto>> getPaymentsByPawnRecord(
            @PathVariable Integer pawnRecordId) {
        return ResponseEntity.ok(interestPaymentService.getByPawnRecordId(pawnRecordId));
    }
}
