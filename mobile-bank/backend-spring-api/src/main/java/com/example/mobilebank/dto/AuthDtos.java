package com.example.mobilebank.dto;

public class AuthDtos {
    public record RegisterRequest(String username, String password, String name) {}
    public record LoginRequest(String username, String password) {}
    public record AuthResponse(String token, String sessionId, Long userId, String username, String name, String role) {}
}
