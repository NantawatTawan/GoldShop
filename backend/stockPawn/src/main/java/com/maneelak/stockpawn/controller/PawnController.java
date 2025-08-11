package com.maneelak.stockpawn.controller;

import com.maneelak.stockpawn.dto.PawnRecordRequestDto;
import com.maneelak.stockpawn.dto.PawnRecordResponseDto;
import com.maneelak.stockpawn.service.PawnService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pawns")
@RequiredArgsConstructor
public class PawnController {

    private final PawnService pawnService;

    @PostMapping
    public ResponseEntity<PawnRecordResponseDto> createPawn(@RequestBody PawnRecordRequestDto request) {
        PawnRecordResponseDto response = pawnService.createPawn(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PawnRecordResponseDto>> getAllPawns() {
        return ResponseEntity.ok(pawnService.getAllPawns());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<PawnRecordResponseDto>> getPawnsByCustomer(@PathVariable Integer customerId) {
        return ResponseEntity.ok(pawnService.getPawnsByCustomerId(customerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PawnRecordResponseDto> getPawnById(@PathVariable Integer id) {
        return ResponseEntity.ok(pawnService.getPawnById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<PawnRecordResponseDto> updatePawn(
            @PathVariable Integer id,
            @RequestBody PawnRecordRequestDto request) {
        return ResponseEntity.ok(pawnService.updatePawn(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePawn(@PathVariable Integer id) {
        pawnService.deletePawn(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/redeem")
    public ResponseEntity<Void> redeemPawn(@PathVariable Integer id) {
        pawnService.redeemPawn(id);
        return ResponseEntity.ok().build();
    }
}
