package com.example.mobilebank.security;

public record AppPrincipal(Long userId, String username, String role, String sessionId) {}
