package com.example.wms.outbound.model;

import java.time.LocalDateTime;

public record Outbound(
        Long id,
        String itemName,
        Integer quantity,
        String outboundStatus,
        String receiverName,
        String outboundDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
