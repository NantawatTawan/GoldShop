package com.maneelak.stockpawn.service;

import com.maneelak.stockpawn.entity.StockType;
import com.maneelak.stockpawn.repository.StockTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockTypeService {

    private final StockTypeRepository stockTypeRepository;


    public List<StockType> getAllTypes() {
        return stockTypeRepository.findAll();
    }


    public StockType findByName(String name) {
        return stockTypeRepository.findByName(name);
    }


    public StockType save(StockType type) {
        return stockTypeRepository.save(type);
    }
}
