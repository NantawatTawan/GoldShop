package com.maneelak.stockpawn.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ActivityLogDto {
    private LocalDateTime timestamp;
    private String description;
    private String type; 
}