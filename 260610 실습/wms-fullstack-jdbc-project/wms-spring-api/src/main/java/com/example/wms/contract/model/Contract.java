package com.example.wms.contract.model;

import java.time.LocalDateTime;

public record Contract(
        Long id,
        String customerName,
        String itemName,
        Integer quantity,
        String warehouseName,
        String contractStatus,
        String requestNote,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
