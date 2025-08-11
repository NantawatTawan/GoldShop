package com.maneelak.stockpawn.controller;

import com.maneelak.stockpawn.entity.StockItem;
import com.maneelak.stockpawn.service.StockItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-items")
@RequiredArgsConstructor
@CrossOrigin 
public class StockItemController {

    private final StockItemService stockItemService;


    @GetMapping
    public ResponseEntity<List<StockItem>> getAll() {
        return ResponseEntity.ok(stockItemService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockItem> getById(@PathVariable Long id) {
        return ResponseEntity.ok(stockItemService.getItemById(id));
    }


    @PostMapping
    public ResponseEntity<StockItem> create(@RequestBody StockItem item) {
        return ResponseEntity.ok(stockItemService.createItem(item));
    }


    @PutMapping("/{id}")
    public ResponseEntity<StockItem> update(@PathVariable Long id, @RequestBody StockItem item) {
        return ResponseEntity.ok(stockItemService.updateItem(id, item));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        stockItemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
