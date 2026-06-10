package com.example.wms.contract.dto;

import java.time.LocalDateTime;

public record ContractResponse(
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
