package com.example.wms.user.model;

import java.time.LocalDateTime;

public record User(
        Long id,
        String email,
        String passwordHash,
        String name,
        String role,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
