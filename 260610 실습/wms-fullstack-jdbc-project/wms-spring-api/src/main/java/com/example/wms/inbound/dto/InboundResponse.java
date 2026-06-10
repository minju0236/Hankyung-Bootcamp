package com.example.wms.inbound.dto;

import java.time.LocalDateTime;

public record InboundResponse(
        Long id,
        Long contractId,
        String itemName,
        Integer quantity,
        String inboundStatus,
        String inboundDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
