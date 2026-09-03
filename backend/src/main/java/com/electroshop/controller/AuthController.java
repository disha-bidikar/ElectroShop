package com.electroshop.controller;

import com.electroshop.dto.AuthDTO;
import com.electroshop.entity.User;
import com.electroshop.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping({"/api/auth/login", "/auth/login"})
    public ResponseEntity<AuthDTO.AuthResponse> login(@RequestBody AuthDTO.LoginRequest request) {
        AuthDTO.AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping({"/api/auth/register", "/auth/register"})
    public ResponseEntity<?> register(@RequestBody AuthDTO.RegisterRequest request) {
        User registeredUser = authService.register(request);
        return ResponseEntity.ok(registeredUser);
    }
}
