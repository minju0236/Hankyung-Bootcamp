package com.example.wms.inbound.dto;

public record InboundRequest(
        Long contractId,
        String itemName,
        Integer quantity,
        String inboundStatus,
        String inboundDate
) {}
