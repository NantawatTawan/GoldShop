package com.maneelak.stockpawn.service;

import com.maneelak.stockpawn.entity.Notification;
import com.maneelak.stockpawn.enums.PawnStatus;
import com.maneelak.stockpawn.repository.NotificationRepository;
import com.maneelak.stockpawn.repository.PawnRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final PawnRecordRepository pawnRecordRepository;

    public List<Notification> getUnreadNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc();
    }

    @Scheduled(cron = "0 0 1 * * *") 
    public void generatePawnNotifications() {
        LocalDate today = LocalDate.now();

        pawnRecordRepository.findAll().stream()
            .filter(p -> p.getStatus() == PawnStatus.ACTIVE)
            .forEach(pawn -> {
                if (pawn.getDueDate().isBefore(today)) {
                    String message = "รายการจำนำ #" + pawn.getPawnNumber() + " เลยกำหนดแล้ว!";
                    createNotification(message, "/pawn/" + pawn.getId());
                } else if (pawn.getDueDate().isBefore(today.plusDays(7))) {
                    String message = "รายการจำนำ #" + pawn.getPawnNumber() + " ใกล้ครบกำหนดใน 7 วัน";
                    createNotification(message, "/pawn/" + pawn.getId());
                }
            });
    }

    private void createNotification(String message, String link) {
         Notification notification = Notification.builder()
            .message(message)
            .isRead(false)
            .createdAt(LocalDateTime.now())
            .linkTo(link)
            .build();
        notificationRepository.save(notification);
    }
}