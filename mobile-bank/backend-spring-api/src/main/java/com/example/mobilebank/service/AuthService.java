package com.example.mobilebank.service;

import com.example.mobilebank.domain.*;
import com.example.mobilebank.dto.AuthDtos.*;
import com.example.mobilebank.repository.AccountRepository;
import com.example.mobilebank.repository.UserRepository;
import com.example.mobilebank.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RedisStateService redisStateService;

    public AuthService(UserRepository userRepository, AccountRepository accountRepository, PasswordEncoder passwordEncoder, JwtService jwtService, RedisStateService redisStateService) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.redisStateService = redisStateService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest r) {
        if (userRepository.existsByUsername(r.username())) throw new IllegalArgumentException("USERNAME_ALREADY_EXISTS");
        User user = userRepository.save(new User(r.username(), passwordEncoder.encode(r.password()), r.name(), UserRole.USER));
        accountRepository.save(new Account(user, makeAccountNumber(user.getId()), new BigDecimal("1000000")));
        return token(user);
    }

    public AuthResponse login(LoginRequest r) {
        User user = userRepository.findByUsername(r.username()).orElseThrow(() -> new IllegalArgumentException("INVALID_CREDENTIALS"));
        if (user.getStatus() == UserStatus.LOCKED) throw new IllegalArgumentException("USER_LOCKED");
        if (!passwordEncoder.matches(r.password(), user.getPasswordHash())) throw new IllegalArgumentException("INVALID_CREDENTIALS");
        return token(user);
    }

    private AuthResponse token(User user) {
        String sessionId = redisStateService.createSession(user.getId(), user.getUsername(), user.getRole().name());
        String token = jwtService.createToken(user.getId(), user.getUsername(), user.getRole().name(), sessionId);
        return new AuthResponse(token, sessionId, user.getId(), user.getUsername(), user.getName(), user.getRole().name());
    }

    private String makeAccountNumber(Long id) { return "110-100-" + String.format("%06d", id); }
}
