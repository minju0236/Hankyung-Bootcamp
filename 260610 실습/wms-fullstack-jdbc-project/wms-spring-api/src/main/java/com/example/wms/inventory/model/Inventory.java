package com.example.wms.inventory.model;

import java.time.LocalDateTime;

public record Inventory(
        Long id,
        String itemName,
        String warehouseName,
        Integer quantity,
        Integer safetyStock,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
