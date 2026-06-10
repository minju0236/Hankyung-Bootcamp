package com.example.wms.notice.model;

import java.time.LocalDateTime;

public record Notice(
        Long id,
        String title,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
