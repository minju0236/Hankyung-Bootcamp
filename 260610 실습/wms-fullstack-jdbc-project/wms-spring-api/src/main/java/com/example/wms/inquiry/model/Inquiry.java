package com.example.wms.inquiry.model;

import java.time.LocalDateTime;

public record Inquiry(
        Long id,
        String title,
        String content,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
