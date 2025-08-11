package com.maneelak.stockpawn.mapper;

import com.maneelak.stockpawn.dto.*;
import com.maneelak.stockpawn.entity.*;

public class UserMapper {

    public static UserResponseDTO toDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(RoleDTO.builder()
                        .id(user.getRole().getId())
                        .name(user.getRole().getName())
                        .build())
                .employee(user.getEmployee() != null ? EmployeeDTO.builder()
                        .id(user.getEmployee().getId())
                        .fullName(user.getEmployee().getFullName())
                        .phone(user.getEmployee().getPhone())
                        .position(user.getEmployee().getPosition())
                        .startDate(user.getEmployee().getStartDate())
                        .salary(user.getEmployee().getSalary())
                        .isActive(user.getEmployee().getIsActive())
                        .build() : null)
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
