package com.example.wms.contract.dto;

public record ContractRequest(
        String customerName,
        String itemName,
        Integer quantity,
        String warehouseName,
        String contractStatus,
        String requestNote
) {}
