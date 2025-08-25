package com.maneelak.stockpawn.controller;

import com.maneelak.stockpawn.dto.TransactionRequestDto;
import com.maneelak.stockpawn.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Void> createTransaction(@RequestBody TransactionRequestDto request) {
        transactionService.performTransaction(request);
        return ResponseEntity.ok().build();
    }
}