package com.electroshop.service;

import com.electroshop.dto.AuthDTO;
import com.electroshop.entity.User;
import com.electroshop.exception.BadRequestException;
import com.electroshop.repository.UserRepository;
import com.electroshop.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        String token = jwtUtils.generateJwtToken(user.getUsername(), user.getRole(), user.getId());
        return new AuthDTO.AuthResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole(), token);
    }

    public User register(AuthDTO.RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        String role = "ROLE_USER";
        if ("admin".equalsIgnoreCase(request.getUsername())) {
            role = "ROLE_ADMIN";
        }

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getEmail() != null ? request.getEmail() : request.getUsername() + "@electroshop.com",
                role
        );

        return userRepository.save(user);
    }
}
