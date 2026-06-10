package com.example.wms.inquiry.dto;

public record InquiryRequest(
        String title,
        String content,
        String status
) {}
