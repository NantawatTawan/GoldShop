package com.maneelak.stockpawn.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private Integer id;
    private String username;
    private String role;
    private String employeeName;
}
