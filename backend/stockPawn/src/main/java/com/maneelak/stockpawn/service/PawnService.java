package com.maneelak.stockpawn.service;

import com.maneelak.stockpawn.dto.PawnItemRequestDto;
import com.maneelak.stockpawn.dto.PawnRecordRequestDto;
import com.maneelak.stockpawn.dto.PawnRecordResponseDto;
import com.maneelak.stockpawn.entity.*;
import com.maneelak.stockpawn.enums.PawnStatus;
import com.maneelak.stockpawn.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PawnService {

    private final PawnRecordRepository pawnRecordRepository;
    private final PawnItemRepository pawnItemRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public PawnRecordResponseDto createPawn(PawnRecordRequestDto dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        User user = userRepository.findById(dto.getCreatedByUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String pawnNumber = "PN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        PawnRecord pawnRecord = PawnRecord.builder()
                .pawnNumber(pawnNumber)
                .customer(customer)
                .createdBy(user)
                .pawnDate(dto.getPawnDate())
                .dueDate(dto.getDueDate())
                .interestPeriodMonths(dto.getInterestPeriodMonths())
                .interestRate(dto.getInterestRate())
                .totalEvaluated(dto.getTotalEvaluated())
                .status(PawnStatus.ACTIVE)
                .build();

        PawnRecord savedRecord = pawnRecordRepository.save(pawnRecord);

        List<PawnItem> items = dto.getItems().stream().map(itemDto ->
                PawnItem.builder()
                        .pawnRecord(savedRecord)
                        .productName(itemDto.getProductName())
                        .weight(itemDto.getWeight())
                        .unit(itemDto.getUnit())
                        .evaluatedPrice(itemDto.getEvaluatedPrice())
                        .note(itemDto.getNote())
                        .imageUrl(itemDto.getImageUrl())
                        .status("stored")
                        .build()
        ).collect(Collectors.toList());

        pawnItemRepository.saveAll(items);

        return toResponseDto(savedRecord, items);
    }

    public List<PawnRecordResponseDto> getAllPawns() {
        return pawnRecordRepository.findAll().stream()
                .map(record -> {
                    List<PawnItem> items = pawnItemRepository.findByPawnRecordId(record.getId());
                    return toResponseDto(record, items);
                }).collect(Collectors.toList());
    }

    public List<PawnRecordResponseDto> getPawnsByCustomerId(Integer customerId) {
        return pawnRecordRepository.findByCustomerId(customerId).stream()
                .map(record -> {
                    List<PawnItem> items = pawnItemRepository.findByPawnRecordId(record.getId());
                    return toResponseDto(record, items);
                }).collect(Collectors.toList());
    }

    public PawnRecordResponseDto getPawnById(Integer id) {
        PawnRecord record = pawnRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pawn not found"));
        List<PawnItem> items = pawnItemRepository.findByPawnRecordId(record.getId());
        return toResponseDto(record, items);
    }

    public PawnRecordResponseDto updatePawn(Integer id, PawnRecordRequestDto dto) {
        PawnRecord record = pawnRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pawn not found"));

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        User user = userRepository.findById(dto.getCreatedByUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        record.setCustomer(customer);
        record.setCreatedBy(user);
        record.setPawnDate(dto.getPawnDate());
        record.setDueDate(dto.getDueDate());
        record.setInterestPeriodMonths(dto.getInterestPeriodMonths());
        record.setInterestRate(dto.getInterestRate());
        record.setTotalEvaluated(dto.getTotalEvaluated());
        pawnRecordRepository.save(record);

        pawnItemRepository.deleteAll(pawnItemRepository.findByPawnRecordId(record.getId()));

        List<PawnItem> newItems = dto.getItems().stream().map(itemDto ->
                PawnItem.builder()
                        .pawnRecord(record)
                        .productName(itemDto.getProductName())
                        .weight(itemDto.getWeight())
                        .unit(itemDto.getUnit())
                        .evaluatedPrice(itemDto.getEvaluatedPrice())
                        .note(itemDto.getNote())
                        .imageUrl(itemDto.getImageUrl())
                        .status("stored")
                        .build()
        ).collect(Collectors.toList());

        pawnItemRepository.saveAll(newItems);

        return toResponseDto(record, newItems);
    }

    public void deletePawn(Integer id) {
        pawnItemRepository.deleteAll(pawnItemRepository.findByPawnRecordId(id));
        pawnRecordRepository.deleteById(id);
    }

    public void redeemPawn(Integer id) {
        PawnRecord record = pawnRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pawn not found"));
        record.setStatus(PawnStatus.REDEEMED);
        record.setRedeemedDate(LocalDate.now());
        pawnRecordRepository.save(record);
    }

    private PawnRecordResponseDto toResponseDto(PawnRecord record, List<PawnItem> items) {
        return PawnRecordResponseDto.builder()
                .id(record.getId())
                .pawnNumber(record.getPawnNumber())
                .customerName(record.getCustomer().getName())
                .pawnDate(record.getPawnDate())
                .dueDate(record.getDueDate())
                .interestPeriodMonths(record.getInterestPeriodMonths())
                .interestRate(record.getInterestRate())
                .totalEvaluated(record.getTotalEvaluated())
                .status(record.getStatus().name())
                .items(items.stream().map(item -> PawnItemRequestDto.builder()
                        .productName(item.getProductName())
                        .weight(item.getWeight())
                        .unit(item.getUnit())
                        .evaluatedPrice(item.getEvaluatedPrice())
                        .note(item.getNote())
                        .imageUrl(item.getImageUrl())
                        .build()
                ).collect(Collectors.toList()))
                .build();
    }
}
