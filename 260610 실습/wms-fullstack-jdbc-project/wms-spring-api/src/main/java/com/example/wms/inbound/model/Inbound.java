package com.example.wms.inbound.model;

import java.time.LocalDateTime;

public record Inbound(
        Long id,
        Long contractId,
        String itemName,
        Integer quantity,
        String inboundStatus,
        String inboundDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
