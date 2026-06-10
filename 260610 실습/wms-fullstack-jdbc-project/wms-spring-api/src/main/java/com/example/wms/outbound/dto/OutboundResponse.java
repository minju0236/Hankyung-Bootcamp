package com.example.wms.outbound.dto;

import java.time.LocalDateTime;

public record OutboundResponse(
        Long id,
        String itemName,
        Integer quantity,
        String outboundStatus,
        String receiverName,
        String outboundDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
