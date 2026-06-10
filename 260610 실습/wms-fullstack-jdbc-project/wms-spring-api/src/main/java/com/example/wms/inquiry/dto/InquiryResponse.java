package com.example.wms.inquiry.dto;

import java.time.LocalDateTime;

public record InquiryResponse(
        Long id,
        String title,
        String content,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
