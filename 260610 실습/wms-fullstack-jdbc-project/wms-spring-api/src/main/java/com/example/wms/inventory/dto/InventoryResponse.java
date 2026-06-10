package com.example.wms.inventory.dto;

import java.time.LocalDateTime;

public record InventoryResponse(
        Long id,
        String itemName,
        String warehouseName,
        Integer quantity,
        Integer safetyStock,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
