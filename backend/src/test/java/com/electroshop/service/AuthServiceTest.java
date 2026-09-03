package com.electroshop.service;

import com.electroshop.dto.AuthDTO;
import com.electroshop.entity.User;
import com.electroshop.repository.UserRepository;
import com.electroshop.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("testuser", "encodedPass", "test@test.com", "ROLE_USER");
        sampleUser.setId(1L);
    }

    @Test
    void testLoginSuccess() {
        AuthDTO.LoginRequest req = new AuthDTO.LoginRequest();
        req.setUsername("testuser");
        req.setPassword("rawPass");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("rawPass", "encodedPass")).thenReturn(true);
        when(jwtUtils.generateJwtToken("testuser", "ROLE_USER", 1L)).thenReturn("mockJwtToken");

        AuthDTO.AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("testuser", res.getUsername());
        assertEquals("mockJwtToken", res.getToken());
    }

    @Test
    void testRegisterSuccess() {
        AuthDTO.RegisterRequest req = new AuthDTO.RegisterRequest();
        req.setUsername("newuser");
        req.setPassword("pass123");
        req.setEmail("newuser@test.com");

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(passwordEncoder.encode("pass123")).thenReturn("encoded123");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        User res = authService.register(req);

        assertNotNull(res);
        assertEquals("newuser", res.getUsername());
        assertEquals("encoded123", res.getPassword());
    }
}
