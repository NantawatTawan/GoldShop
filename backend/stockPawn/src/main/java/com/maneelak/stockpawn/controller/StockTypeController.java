package com.maneelak.stockpawn.controller;

import com.maneelak.stockpawn.entity.StockType;
import com.maneelak.stockpawn.service.StockTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-types")
@RequiredArgsConstructor
@CrossOrigin
public class StockTypeController {

    private final StockTypeService stockTypeService;

    @GetMapping
    public ResponseEntity<List<StockType>> getAllTypes() {
        return ResponseEntity.ok(stockTypeService.getAllTypes());
    }


    @PostMapping
    public ResponseEntity<StockType> createType(@RequestBody StockType type) {

        StockType existing = stockTypeService.findByName(type.getName());
        if (existing != null) {
            return ResponseEntity.ok(existing);
        }

        StockType saved = stockTypeService.save(type);
        return ResponseEntity.ok(saved);
    }
}