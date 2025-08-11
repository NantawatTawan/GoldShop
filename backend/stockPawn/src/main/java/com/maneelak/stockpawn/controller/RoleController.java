package com.maneelak.stockpawn.controller;

import com.maneelak.stockpawn.entity.Role;
import com.maneelak.stockpawn.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RoleController {

    private final RoleRepository roleRepository;

    @GetMapping
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }


    @PostMapping
    public Role createRole(@RequestBody Role role) {
        return roleRepository.save(role);
    }
}
