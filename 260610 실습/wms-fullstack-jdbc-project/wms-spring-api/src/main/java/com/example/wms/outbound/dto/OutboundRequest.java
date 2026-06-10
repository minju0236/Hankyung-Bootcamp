package com.example.wms.outbound.dto;

public record OutboundRequest(
        String itemName,
        Integer quantity,
        String outboundStatus,
        String receiverName,
        String outboundDate
) {}
