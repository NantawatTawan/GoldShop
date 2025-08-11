package com.maneelak.stockpawn.controller;

import com.maneelak.stockpawn.dto.LoginRequestDTO;
import com.maneelak.stockpawn.dto.LoginResponseDTO;
import com.maneelak.stockpawn.entity.User;
import com.maneelak.stockpawn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        User user = userRepository.findByUsername(request.getUsername()).orElse(null);
        if (user == null || !user.getIsActive()) {
            return ResponseEntity.status(401).body("ชื่อผู้ใช้ไม่ถูกต้อง");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("รหัสผ่านไม่ถูกต้อง");
        }

        LoginResponseDTO response = new LoginResponseDTO();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setRole(user.getRole().getName());
        response.setEmployeeName(user.getEmployee().getFullName());

        return ResponseEntity.ok(response);
    }
}
