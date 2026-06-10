package com.example.wms.inventory.dto;

public record InventoryRequest(
        String itemName,
        String warehouseName,
        Integer quantity,
        Integer safetyStock
) {}
