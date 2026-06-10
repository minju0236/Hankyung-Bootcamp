package com.example.wms.auth.dto;

public record AuthResponse(Long userId, String email, String name, String role, String token) {}
